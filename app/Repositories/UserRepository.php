<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function getAllPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = User::select(
            'id', 'firstname', 'lastname', 'email', 'email_verified_at', 
            'user_type', 'status', 'gender', 'phone_number', 'address',
            'photo', 'id_type', 'id_photo',
            'birthdate', 'age', 'created_at', 'updated_at'
        );

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['filter']) && $filters['filter'] !== 'all') {
            $query->where('user_type', $filters['filter']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function countByStatus(string $status): int
    {
        return User::where('status', $status)->count();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function find(int $id): ?User
    {
        return User::find($id);
    }
}