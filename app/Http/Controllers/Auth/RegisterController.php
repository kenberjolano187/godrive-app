<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\VerifyAccountNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status' => User::STATUS_INACTIVE,
            'user_type' => 'customer',
        ]);

        Auth::login($user);

        $token = Str::random(64);
        
        Cache::put("account_verification:{$user->email}", $token, now()->addHours(24));
        
        $verificationUrl = route('verification.account.show', [
            'email' => $user->email,
            'token' => $token,
        ]);

        $user->notify(new VerifyAccountNotification($verificationUrl));

        return redirect()->route('verification.notice');
    }
}