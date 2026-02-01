<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Mail;

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

Route::get('/email/verify', function () {
    return Inertia::render('auth/verify-email', [
        'status' => session('status'),
    ]);
})->middleware('auth')->name('verification.notice');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => true,
    ]);
})->name('home');

Route::prefix('customer')->name('customer.')->middleware(['auth', 'verified', 'user.type:customer'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('customer/dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'user.type:owner,admin'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');
});

Route::get('/test-email-connection', function () {
    try {
        Mail::raw('Hello! Kung nabasa ni nimo, SUCCESS ang imong email settings!', function ($msg) {
            $msg->to('kenberjolano187@gmail.com')
                ->subject('Test Email gikan sa Railway');
        });
        return 'SUCCESS: Check your inbox. Okay na ang connection!';
    } catch (\Exception $e) {
        return 'ERROR: ' . $e->getMessage();
    }
});

require __DIR__ . '/otp.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/appearance.php';
require __DIR__ . '/approve.php';