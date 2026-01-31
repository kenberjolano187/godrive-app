<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->search,
            'filter' => $request->get('filter', 'all'),
            'status' => $request->get('status', 'all'),
        ];

        $data = $this->userService->getUsers($filters);

        return Inertia::render('admin/user/index', [
            ...$data,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/user/create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->userService->createUser($request->validated());

        return redirect()
            ->route('user.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user): Response
    {
        return Inertia::render('admin/user/show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/user/edit', [
            'user' => $user,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->userService->updateUser($user, $request->validated());

        return redirect()
            ->route('user.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        $this->userService->deleteUser($user);

        return redirect()
            ->route('user.index')
            ->with('success', 'User deleted successfully.');
    }

    public function approve(User $user): RedirectResponse
    {
        if ($user->user_type !== 'owner') {
            return back()->with('error', 'Only owner accounts can be approved.');
        }

        if ($user->status === 'active') {
            return back()->with('info', 'This account is already approved.');
        }

        $user->update(['status' => User::STATUS_ACTIVE]);

        return back()->with('success', "Owner account for {$user->name} has been approved.");
    }
}