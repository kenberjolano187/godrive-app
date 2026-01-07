<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isOwnerRegistration = $this->boolean('is_owner_registration', false);
        
        if ($isOwnerRegistration) {
            return [
                'email' => 'required|email|unique:users,email',
                'is_owner_registration' => 'boolean',
            ];
        }
        
        return [
            'email' => 'required|email|exists:users,email',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Email is required.',
            'email.exists' => 'Email not found.',
            'email.unique' => 'This email is already registered.',
        ];
    }
}