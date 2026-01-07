<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'firstname' => 'required|string|max:250',
            'lastname' => 'required|string|max:250',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'gender' => 'required|in:male,female,other',
            'birthdate' => 'nullable|date|before:today',
            'age' => 'nullable|integer|min:1|max:120',
            'phone_number' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'id_type' => 'nullable|string|max:100',
            'id_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'user_type' => 'required|in:admin,owner,customer',
            'status' => 'required|in:active,inactive,block',
        ];
    }

    public function messages(): array
    {
        return [
            'firstname.required' => 'First name is required',
            'lastname.required' => 'Last name is required',
            'email.required' => 'Email is required',
            'email.unique' => 'This email is already registered',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',
        ];
    }
}