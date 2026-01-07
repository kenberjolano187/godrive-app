<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

class VerificationRepository
{
    private const CACHE_PREFIX = 'account_verification:';
    private const TOKEN_EXPIRY = 24;

    public function findUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function storeVerificationToken(string $email, string $token): void
    {
        Cache::put(
            self::CACHE_PREFIX . $email,
            $token,
            now()->addHours(self::TOKEN_EXPIRY)
        );
    }

    public function getVerificationToken(string $email): ?string
    {
        return Cache::get(self::CACHE_PREFIX . $email);
    }

    public function deleteVerificationToken(string $email): void
    {
        Cache::forget(self::CACHE_PREFIX . $email);
    }

    public function updateUserOtp(User $user, string $otp, int $expiryMinutes = 10): bool
    {
        return $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes($expiryMinutes),
        ]);
    }

    public function clearUserOtp(User $user): bool
    {
        return $user->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);
    }

    public function verifyUser(User $user, array $data): bool
    {
        return $user->update([
            ...$data,
            'email_verified_at' => now(),
            'status' => User::STATUS_ACTIVE,
            'otp' => null,
            'otp_expires_at' => null,
        ]);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }
}