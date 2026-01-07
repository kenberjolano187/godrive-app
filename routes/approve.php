<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'user.type:admin'])->group(function () {
    Route::resource('user', UserController::class);
    Route::patch('/user/{user}/approve', [UserController::class, 'approve'])->name('user.approve');
});