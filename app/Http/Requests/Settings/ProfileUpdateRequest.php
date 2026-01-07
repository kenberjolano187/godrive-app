<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'firstname' => ['required', 'string', 'max:250'],
            'lastname' => ['required', 'string', 'max:250'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif', 'max:2048'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'firstname.required' => 'First name is required.',
            'lastname.required' => 'Last name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email address is already taken.',
            'photo.image' => 'The file must be an image.',
            'photo.mimes' => 'The photo must be a file of type: jpeg, jpg, png, gif.',
            'photo.max' => 'The photo must not be larger than 2MB.',
        ];
    }
}