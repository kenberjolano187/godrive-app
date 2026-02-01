<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Notifications\VerifyAccountNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function create(array $input): User
    {
        Validator::make($input, [
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => $this->passwordRules(),
            'user_type' => ['sometimes', 'string', 'in:customer,owner'], 
        ])->validate();

        $user = User::create([
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
            'status' => User::STATUS_INACTIVE,
            'user_type' => $input['user_type'] ?? 'customer', 
        ]);

        $token = Str::random(64);
        
        Cache::put("account_verification:{$user->email}", $token, now()->addHours(24));
        
        $verificationUrl = route('verification.account.show', [
            'email' => $user->email,
            'token' => $token,
        ]);
        
        $user->notify(new VerifyAccountNotification($verificationUrl));

        return $user;
    }
}