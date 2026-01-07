<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\AccountVerificationNotification;
use App\Notifications\VerifyAccountNotification;
use App\Repositories\VerificationRepository;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class VerificationService
{
    public function __construct(
        private VerificationRepository $repository,
        private FileUploadService $fileUploadService
    ) {}

    public function validateVerificationToken(string $email, ?string $token): bool
    {
        if (!$token) {
            return true;
        }
        
        $storedToken = $this->repository->getVerificationToken($email);
        return $storedToken && $storedToken === $token;
    }

    public function validateOtp(string $email, string $otp): array
    {
        $user = $this->repository->findUserByEmail($email);

        if (!$user) {
            return ['valid' => false, 'message' => 'User not found.', 'status' => 404];
        }

        if (!$user->otp || $user->otp !== $otp) {
            return ['valid' => false, 'message' => 'Invalid verification code.', 'status' => 400];
        }

        if (!$user->otp_expires_at || now()->isAfter($user->otp_expires_at)) {
            return ['valid' => false, 'message' => 'Verification code has expired.', 'status' => 400];
        }

        return ['valid' => true, 'message' => 'OTP verified successfully.', 'status' => 200];
    }

    public function verifyAccount(array $data, string $email, ?string $token, string $otp): array
    {
        if ($token && !$this->validateVerificationToken($email, $token)) {
            return ['success' => false, 'error' => 'token', 'message' => 'Invalid or expired verification token.'];
        }

        $isNewOwner = isset($data['user_type']) && $data['user_type'] === 'owner' && !$token;

        $user = $this->repository->findUserByEmail($email);
        
        if (!$user && !$isNewOwner) {
            return ['success' => false, 'error' => 'email', 'message' => 'User not found.'];
        }

        if ($isNewOwner && !$user) {
            $user = $this->createOwnerUser($data, $email);
        }

        $otpValidation = $this->validateOtp($email, $otp);
        if (!$otpValidation['valid']) {
            return ['success' => false, 'error' => 'otp', 'message' => $otpValidation['message']];
        }

        $updateData = [
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'gender' => $data['gender'],
            'birthdate' => $data['birthdate'],
            'age' => $data['age'],
            'phone_number' => $data['phone_number'],
            'address' => $data['address'],
            'id_type' => $data['id_type'],
        ];

        if ($isNewOwner && isset($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        if (isset($data['id_photo']) && $data['id_photo'] instanceof UploadedFile) {
            $updateData['id_photo'] = $this->fileUploadService->upload($data['id_photo']);
        }

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $updateData['photo'] = $this->fileUploadService->upload($data['photo']);
        }

        $status = isset($data['user_type']) && $data['user_type'] === 'owner' 
            ? User::STATUS_INACTIVE
            : User::STATUS_ACTIVE;

        $updateData['status'] = $status;
        $updateData['email_verified_at'] = now();
        $updateData['otp'] = null;
        $updateData['otp_expires_at'] = null;

        $this->repository->update($user, $updateData);

        if ($token) {
            $this->repository->deleteVerificationToken($email);
        }

        return ['success' => true, 'user' => $user->fresh()];
    }

    private function createOwnerUser(array $data, string $email): User
    {
        return User::create([
            'email' => $email,
            'password' => Hash::make($data['password']),
            'user_type' => User::TYPE_OWNER,
            'status' => User::STATUS_INACTIVE,
        ]);
    }

    public function sendOtp(string $email, bool $isOwnerRegistration = false): array
    {
        if (!$isOwnerRegistration) {
            $storedToken = $this->repository->getVerificationToken($email);
            if (!$storedToken) {
                return ['success' => false, 'message' => 'Invalid verification session.', 'status' => 400];
            }
        }

        $user = $this->repository->findUserByEmail($email);
        
        if (!$user && $isOwnerRegistration) {
            $user = User::create([
                'email' => $email,
                'password' => Hash::make(Str::random(32)),
                'user_type' => User::TYPE_OWNER,
                'status' => User::STATUS_INACTIVE,
            ]);
        }

        if (!$user) {
            return ['success' => false, 'message' => 'User not found.', 'status' => 404];
        }

        $otp = $this->generateOtp();

        $this->repository->updateUserOtp($user, $otp);

        $user->notify(new AccountVerificationNotification($otp));

        return ['success' => true, 'message' => 'Verification code sent successfully.'];
    }

    public function resendVerification(string $email): array
    {
        $user = $this->repository->findUserByEmail($email);
        
        if (!$user) {
            return ['success' => false, 'message' => 'User not found.'];
        }

        $token = Str::random(64);

        $this->repository->storeVerificationToken($email, $token);

        $this->repository->clearUserOtp($user);

        $verificationUrl = route('verification.account.show', [
            'email' => $email,
            'token' => $token,
        ]);

        $user->notify(new VerifyAccountNotification($verificationUrl));

        return ['success' => true, 'message' => 'Verification link sent successfully.'];
    }

    private function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}