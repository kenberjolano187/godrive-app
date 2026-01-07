<?php

use App\Http\Controllers\Auth\VerifyAccountController;
use Illuminate\Support\Facades\Route;

Route::prefix('verification/account')->name('verification.account.')->group(function () {
    Route::get('/', [VerifyAccountController::class, 'show'])->name('show');
    Route::post('/verify', [VerifyAccountController::class, 'verify'])->name('verify');
    Route::post('/send-otp', [VerifyAccountController::class, 'sendOtp'])->name('send-otp');
    Route::post('/verify-otp', [VerifyAccountController::class, 'verifyOtp'])->name('verify-otp');
    Route::post('/resend', [VerifyAccountController::class, 'resend'])->name('resend');
});

Route::get('/owner-application', [VerifyAccountController::class, 'showOwnerApplication'])
    ->name('owner.application');