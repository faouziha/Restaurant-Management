<?php

namespace App\Http\Controllers;

use App\Models\StaffProfile;
use App\Models\User;
use App\UserType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeesController extends Controller
{
    public function index()
    {
        $employees = StaffProfile::with('user')
            ->latest()
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'staff_id' => $profile->staff_id_number,
                    'name' => $profile->user->name,
                    'email' => $profile->user->email,
                    'type' => $profile->user->type,
                    'hire_date' => $profile->hire_date->format('M d, Y'), // Assumes hire_date is cast to date
                    'hourly_rate' => $profile->hourly_rate,
                ];
            });
        // We will need to query the users/profiles here later!
        return Inertia::render("employees/index", [
            'employees' => $employees
        ]);
    }

    public function create()
    {
        return Inertia::render("employees/create");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'type' => ['required', Rule::enum(UserType::class)],
            'staff_id_number' => 'required|string|max:50|unique:staff_profiles',
            'date_of_birth' => 'required|date',
            'hire_date' => 'required|date',
            'phone_number' => 'nullable|string|max:20',
            'emergency_contact' => 'nullable|string|max:255',
            'hourly_rate' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'type' => $validated['type'],
            ]);

            StaffProfile::create([
                'user_id' => $user->id,
                'staff_id_number' => $validated['staff_id_number'],
                'date_of_birth' => $validated['date_of_birth'],
                'hire_date' => $validated['hire_date'],
                'phone_number' => $validated['phone_number'],
                'emergency_contact' => $validated['emergency_contact'],
                'hourly_rate' => $validated['hourly_rate'],
            ]);
        });

        return redirect()->back()->with('success', 'New staff member hired successfully!');
    }

    public function show(StaffProfile $employee)
    {
        Gate::authorize('view', $employee);

        return Inertia::render('employees/show', [
            'employee' => [
                'id' => $employee->id,
                // Use the same key name as your Index page!
                'staff_id' => $employee->staff_id_number,
                'name' => $employee->user->name,
                'email' => $employee->user->email,
                'type' => $employee->user->type,
                // Format the date here so React doesn't have to
                'hire_date' => $employee->hire_date->format('M d, Y'),
                'date_of_birth' => $employee->date_of_birth ? $employee->date_of_birth->format('M d, Y') : null,
                'hourly_rate' => $employee->hourly_rate,
            ],
        ]);
    }

    public function edit(StaffProfile $employee)
    {
        Gate::authorize('update', $employee);
        $employee->load('user');

        return Inertia::render('employees/edit', [
            'employee' => array_merge($employee->toArray(), [
                'date_of_birth' => $employee->date_of_birth?->format('Y-m-d'),
                'hire_date' => $employee->hire_date?->format('Y-m-d'),
                'user' => $employee->user
            ]),
        ]);
    }

    public function update(Request $request, StaffProfile $employee)
    {
        Gate::authorize('update', $employee);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // Trap 1 Fixed: Ignore the current user's email
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($employee->user_id)
            ],
            // Trap 2 Fixed: Password is nullable on update
            'password' => 'nullable|string|min:8|confirmed',
            // Trap 1 Fixed: Ignore the current profile's staff_id_number
            'staff_id_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('staff_profiles')->ignore($employee->id)
            ],
            'date_of_birth' => 'required|date',
            'hire_date' => 'required|date',
            'phone_number' => 'nullable|string|max:20',
            'emergency_contact' => 'nullable|string|max:255',
            'hourly_rate' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $employee) {

            // 1. Prepare User Data
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            // Only update the password if the manager actually typed a new one
            if (!empty($validated['password'])) {
                $userData['password'] = $validated['password'];
            }

            // Update the attached User model
            $employee->user->update($userData);

            // 2. Update the Staff Profile model
            $employee->update([
                'staff_id_number' => $validated['staff_id_number'],
                'date_of_birth' => $validated['date_of_birth'],
                'hire_date' => $validated['hire_date'],
                'phone_number' => $validated['phone_number'],
                'emergency_contact' => $validated['emergency_contact'],
                'hourly_rate' => $validated['hourly_rate'],
            ]);
        });

        return redirect()->back()->with('success', 'Staff member updated successfully!');
    }

    public function destroy(StaffProfile $employee)
    {
        Gate::authorize('delete', $employee);

        optional($employee->user)->delete();
        $employee->delete();

        // Fixed: Redirects to /employees instead of /staffProfiles
        return redirect('/employees')->with('success', 'Staff member removed.');
    }
}
