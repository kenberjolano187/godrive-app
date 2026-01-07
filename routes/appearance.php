<?php

use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/user/appearance', [UserPreferenceController::class, 'updateAppearance']);
});