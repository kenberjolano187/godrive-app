import { useState, FormEvent, useRef, useEffect } from 'react';
import SidebarLayout from '@/layouts/sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, Upload, X } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { getImageUrl } from '@/lib/image-helpers';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    gender: string;
    birthdate: string | null;
    age: number | null;
    phone_number: string;
    address: string;
    id_type: string | null;
    id_photo: string | null;
    user_type: string;
    status: string;
    email: string;
    photo: string | null;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        getImageUrl(user.photo)
    );
    const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(
        getImageUrl(user.id_photo)
    );
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const idPhotoInputRef = useRef<HTMLInputElement>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit User',
            href: `/user/${user.id}/edit`,
        },
    ];

    const calculateAge = (birthdate: string) => {
        if (!birthdate) return '';
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    };

    const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const birthdate = e.target.value;
        setData('birthdate', birthdate);
        if (birthdate) {
            setData('age', calculateAge(birthdate));
        }
    };
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        gender: user.gender || '',
        birthdate: user.birthdate || '',
        age: user.age?.toString() || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        id_type: user.id_type || '',
        id_photo: null as File | null,
        user_type: user.user_type || 'customer',
        status: user.status || 'active',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        photo: null as File | null,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        post(`/user/${user.id}`, {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const previewUrl = getImageUrl(file);
            setPhotoPreview(previewUrl);
        }
    };

    const handleIdPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('id_photo', file);
            const previewUrl = getImageUrl(file);
            setIdPhotoPreview(previewUrl);
        }
    };

    const removePhoto = () => {
        if (photoPreview && photoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(photoPreview);
        }
        
        setData('photo', null);
        setPhotoPreview(getImageUrl(user.photo));
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeIdPhoto = () => {
        if (idPhotoPreview && idPhotoPreview.startsWith('blob:')) {
            URL.revokeObjectURL(idPhotoPreview);
        }
        
        setData('id_photo', null);
        setIdPhotoPreview(getImageUrl(user.id_photo));
        
        if (idPhotoInputRef.current) {
            idPhotoInputRef.current.value = '';
        }
    };

    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
            if (idPhotoPreview && idPhotoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(idPhotoPreview);
            }
        };
    }, []);

    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                    </div>
                    <Button asChild>
                        <Link href="/user">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                </div>

                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    {photoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={photoPreview}
                                                alt="Preview"
                                                className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            {data.photo && (
                                                <button
                                                    type="button"
                                                    onClick={removePhoto}
                                                    className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md text-foreground hover:text-foreground/80"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="photo">Upload Photo</Label>
                                    <Input
                                        id="photo"
                                        name="photo"
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif"
                                        onChange={handlePhotoChange}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-sm text-muted-foreground">
                                        JPG, PNG (MAX. 3MB)
                                    </p>
                                    {errors.photo && (
                                        <p className="text-sm text-destructive">
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname">First Name</Label>
                                        <Input
                                            id="firstname"
                                            name="firstname"
                                            value={data.firstname}
                                            onChange={(e) => setData('firstname', e.target.value)}
                                            placeholder="First Name"
                                            maxLength={250}
                                            autoComplete="given-name"
                                            autoFocus
                                        />
                                        {errors.firstname && (
                                            <p className="text-sm text-destructive">
                                                {errors.firstname}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            value={data.lastname}
                                            onChange={(e) => setData('lastname', e.target.value)}
                                            placeholder="Last Name"
                                            maxLength={250}
                                            autoComplete="family-name"
                                        />
                                        {errors.lastname && (
                                            <p className="text-sm text-destructive">
                                                {errors.lastname}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        name="gender"
                                        value={data.gender}
                                        onValueChange={(value) => setData('gender', value)}
                                    >
                                        <SelectTrigger id="gender">
                                            <SelectValue>
                                                {data.gender ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1) : 'Select gender'}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && (
                                        <p className="text-sm text-destructive">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="birthdate">Birthdate</Label>
                                    <Input
                                        id="birthdate"
                                        name="birthdate"
                                        type="date"
                                        value={data.birthdate}
                                        onChange={handleBirthdateChange}
                                        autoComplete="off"
                                    />
                                    {errors.birthdate && (
                                        <p className="text-sm text-destructive">
                                            {errors.birthdate}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="text"
                                        value={data.age}
                                        readOnly
                                        className="bg-muted"
                                        placeholder=""
                                    />
                                    {errors.age && (
                                        <p className="text-sm text-destructive">
                                            {errors.age}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        placeholder="+09xxxxxxxxx"
                                        maxLength={100}
                                        autoComplete="tel"
                                    />
                                    {errors.phone_number && (
                                        <p className="text-sm text-destructive">
                                            {errors.phone_number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Enter complete address"
                                    rows={3}
                                    autoComplete="street-address"
                                />
                                {errors.address && (
                                    <p className="text-sm text-destructive">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">ID Information</h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_type">ID Type</Label>
                                        <Select
                                            name="id_type"
                                            value={data.id_type}
                                            onValueChange={(value) => setData('id_type', value)}
                                        >
                                            <SelectTrigger id="id_type">
                                                <SelectValue>
                                                    {data.id_type || 'Select ID type'}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PRC ID">PRC ID</SelectItem>
                                                <SelectItem value="Passport">Passport</SelectItem>
                                                <SelectItem value="Driver's License">Driver's License</SelectItem>
                                                <SelectItem value="National ID">National ID</SelectItem>
                                                <SelectItem value="Voter's ID">Voter's ID</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.id_type && (
                                            <p className="text-sm text-destructive">
                                                {errors.id_type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="id_photo">ID Photo</Label>
                                        <Input
                                            id="id_photo"
                                            name="id_photo"
                                            ref={idPhotoInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handleIdPhotoChange}
                                            className="cursor-pointer"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            JPG, PNG (MAX. 2MB)
                                        </p>
                                        {errors.id_photo && (
                                            <p className="text-sm text-destructive">
                                                {errors.id_photo}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {idPhotoPreview && (
                                    <div className="mt-4">
                                        <div className="relative inline-block">
                                            <img
                                                src={idPhotoPreview}
                                                alt="ID Preview"
                                                className="h-40 w-auto object-cover border-2 border-gray-200 rounded"
                                            />
                                            {data.id_photo && (
                                                <button
                                                    type="button"
                                                    onClick={removeIdPhoto}
                                                    className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md text-foreground hover:text-foreground/80"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@gmail.com"
                                        autoComplete="email"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_type">User Type</Label>
                                    <Select
                                        name="user_type"
                                        value={data.user_type}
                                        onValueChange={(value) => setData('user_type', value)}
                                    >
                                        <SelectTrigger id="user_type">
                                            <SelectValue placeholder="Select user type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="customer">Customer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.user_type && (
                                        <p className="text-sm text-destructive">
                                            {errors.user_type}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Account Status</Label>
                                    <Select
                                        name="status"
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="block">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h4 className="font-medium mb-4">Change Password</h4>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter new password"
                                                className="pr-10"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-destructive">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                className="pr-10"
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-destructive">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <Button variant="outline" type="button" asChild disabled={processing}>
                                <Link href="/user">Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating' : 'Update User'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </SidebarLayout>
    );
}