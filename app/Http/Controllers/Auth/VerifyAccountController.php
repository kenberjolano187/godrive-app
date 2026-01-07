<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyAccountRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\VerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class VerifyAccountController extends Controller
{
    public function __construct(
        private VerificationService $verificationService
    ) {}

    public function show(Request $request): Response|RedirectResponse
    {
        $email = $request->query('email');
        $token = $request->query('token');
        $type = $request->query('type', 'customer');

        if (!$email || !$token) {
            return redirect()
                ->route('login')
                ->with('error', 'Invalid verification link.');
        }

        if (!$this->verificationService->validateVerificationToken($email, $token)) {
            return redirect()
                ->route('login')
                ->with('error', 'Invalid or expired verification link.');
        }

        return Inertia::render('auth/verify-account', [
            'email' => $email,
            'token' => $token,
            'userType' => $type,
        ]);
    }

    public function showOwnerApplication(): Response
    {
        return Inertia::render('auth/owner-application', [
            'email' => '',
            'token' => '',
            'userType' => 'owner',
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        $result = $this->verificationService->validateOtp(
            $validated['email'],
            $validated['otp']
        );

        return response()->json([
            'message' => $result['message'],
            'valid' => $result['valid']
        ], $result['status']);
    }

    public function verify(VerifyAccountRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $result = $this->verificationService->verifyAccount(
            $validated,
            $validated['email'],
            $validated['token'] ?? null,
            $validated['otp']
        );

        if (!$result['success']) {
            throw ValidationException::withMessages([
                $result['error'] => $result['message'],
            ]);
        }

        if ($result['user']->user_type === 'owner' && $result['user']->status === 'inactive') {
            return redirect()
                ->route('home')
                ->with('success', 'Registration successful! Your account is pending admin approval.');
        }

        Auth::login($result['user'], true);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Your account has been verified successfully!');
    }

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $isOwnerRegistration = $request->boolean('is_owner_registration', false);

        $result = $this->verificationService->sendOtp($validated['email'], $isOwnerRegistration);

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], $result['status']);
        }

        return response()->json([
            'message' => $result['message']
        ]);
    }

    public function resend(SendOtpRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $result = $this->verificationService->resendVerification($validated['email']);

        if (!$result['success']) {
            return back()->withErrors(['email' => $result['message']]);
        }

        return back()->with('status', 'verification-link-sent');
    }
}