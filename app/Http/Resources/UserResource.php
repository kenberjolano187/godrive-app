<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at?->format('Y-m-d H:i:s'),
            'user_type' => $this->user_type,
            'status' => $this->status,
            'gender' => $this->gender,
            'phone_number' => $this->phone_number,
            'address' => $this->address,
            'birthdate' => $this->birthdate?->format('Y-m-d'),
            'age' => $this->age,
            'id_type' => $this->id_type,
            'photo' => $this->photo ? asset($this->photo) : null,
            'id_photo' => $this->id_photo ? asset($this->id_photo) : null,
            'is_admin' => $this->isAdmin(),
            'is_owner' => $this->isOwner(),
            'is_customer' => $this->isCustomer(),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}