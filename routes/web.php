<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

Route::get('/email/verify', function () {
    return Inertia::render('auth/verify-email', [
        'status' => session('status'),
    ]);
})->middleware('auth')->name('verification.notice');

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

require __DIR__ . '/otp.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/appearance.php';
require __DIR__ . '/approve.php';