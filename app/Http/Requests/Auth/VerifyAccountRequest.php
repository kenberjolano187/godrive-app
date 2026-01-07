<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyAccountRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => 'nullable|string',
            'email' => 'required|email',
            'password' => 'nullable|required_with:user_type|min:8|confirmed',
            'otp' => 'required|string|size:6',
            'firstname' => 'required|string|max:250',
            'lastname' => 'required|string|max:250',
            'gender' => 'required|in:Male,Female',
            'birthdate' => 'required|date|before:today',
            'age' => 'required|integer|min:1|max:150',
            'phone_number' => 'required|string|max:100',
            'address' => 'required|string',
            'id_type' => 'required|string|max:100',
            'id_photo' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'photo' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
            'user_type' => 'nullable|in:customer,owner',
            'terms_accepted' => 'accepted',
        ];
    }

    public function messages(): array
    {
        return [
            'otp.required' => 'Verification code is required.',
            'otp.size' => 'Verification code must be 6 digits.',
            'id_photo.required' => 'ID photo is required for verification.',
            'id_photo.max' => 'ID photo must not exceed 10MB.',
            'photo.max' => 'Profile photo must not exceed 5MB.',
            'password.required_with' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}