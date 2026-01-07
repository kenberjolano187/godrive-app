<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use App\Http\Resources\UserResource;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private FileUploadService $fileUploadService
    ) {}

    public function getUsers(array $filters, int $perPage = 10)
    {
        $users = $this->userRepository->getAllPaginated($filters, $perPage);
        
        $users->getCollection()->transform(function ($user) {
            return (new UserResource($user))->resolve();
        });
        
        return [
            'users' => $users,
            'activeUsers' => $this->userRepository->countByStatus('active'),
            'inactiveUsers' => $this->userRepository->countByStatus('inactive'),
            'blockedUsers' => $this->userRepository->countByStatus('block'),
        ];
    }

    public function createUser(array $data): User
    {
 
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $data['email_verified_at'] = now();

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $data['photo'] = $this->fileUploadService->upload($data['photo']);
        }

        if (isset($data['id_photo']) && $data['id_photo'] instanceof UploadedFile) {
            $data['id_photo'] = $this->fileUploadService->upload($data['id_photo']);
        }

        return $this->userRepository->create($data);
    }

    public function updateUser(User $user, array $data): User
    {

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $this->fileUploadService->delete($user->photo);
            $data['photo'] = $this->fileUploadService->upload($data['photo']);
        } else {
            unset($data['photo']);
        }

        if (isset($data['id_photo']) && $data['id_photo'] instanceof UploadedFile) {
            $this->fileUploadService->delete($user->id_photo);
            $data['id_photo'] = $this->fileUploadService->upload($data['id_photo']);
        } else {
            unset($data['id_photo']);
        }

        $this->userRepository->update($user, $data);

        return $user->fresh();
    }

    public function deleteUser(User $user): bool
    {

        $this->fileUploadService->delete($user->photo);
        $this->fileUploadService->delete($user->id_photo);

        return $this->userRepository->delete($user);
    }
}