import { useState, useEffect } from 'react';
import SidebarLayout from '@/layouts/sidebar-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Link, router } from '@inertiajs/react';
import {
    Edit,
    Plus,
    Trash2,
    Search,
    X,
    MoreHorizontal,
    Eye,
    UserRoundPlus,
    Users,
    UserCheck,
    UserX,
    RotateCcw,
    ShieldAlert,
    CheckCircle2,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    user_type: string;
    status: string;
    gender: string;
    phone_number: string | null;
    photo: string | null;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    users: PaginatedUsers;
    activeUsers: number;
    inactiveUsers: number;
    blockedUsers: number;
    filters?: {
        search?: string;
        filter?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Management',
        href: '/user',
    },
];

const getUserTypeLabel = (usertype: string) => {
    return usertype.charAt(0).toUpperCase() + usertype.slice(1);
};

const RoleBadge = ({ usertype }: { usertype: string }) => {
    const variant = usertype === 'admin'
        ? 'default'
        : usertype === 'owner'
        ? 'secondary'
        : 'outline';

    return (
        <Badge variant={variant}>
            {getUserTypeLabel(usertype)}
        </Badge>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const variant = status === 'active'
        ? 'default'
        : status === 'inactive'
        ? 'secondary'
        : 'destructive';

    return (
        <Badge variant={variant}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

export default function UserIndex({ 
    users, 
    activeUsers = 0, 
    inactiveUsers = 0, 
    blockedUsers = 0,
    filters = {} 
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [filter, setFilter] = useState(filters.filter || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters.search || '';
            const currentFilter = filters.filter || 'all';
            const currentStatus = filters.status || 'all';

            if (search === currentSearch && filter === currentFilter && statusFilter === currentStatus) {
                return;
            }

            router.visit('/user', {
                method: 'get',
                data: {
                    search: search || undefined,
                    filter: filter !== 'all' ? filter : undefined,
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                },
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['users', 'activeUsers', 'inactiveUsers', 'blockedUsers', 'filters'],
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [search, filter, statusFilter]);

    const handleDelete = (id: number) => {
        router.delete(`/user/${id}`, {
            preserveScroll: true,
        });
    };

    const handleApprove = (id: number) => {
        router.patch(`/user/${id}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setFilter('all');
        setStatusFilter('all');
        router.visit('/user', {
            method: 'get',
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.visit('/user', {
            method: 'get',
            data: {
                page: page,
                search: search || undefined,
                filter: filter !== 'all' ? filter : undefined,
                status: statusFilter !== 'all' ? statusFilter : undefined,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const stats = {
        total: users.total,
        active: activeUsers,
        inactive: inactiveUsers,
        blocked: blockedUsers,
    };

    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    </div>
                    <Button asChild>
                        <Link href="/user/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Total Users</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <Users className="h-8 w-8" />
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Active</p>
                                <p className="text-2xl font-bold">{stats.active}</p>
                            </div>
                            <UserCheck className="h-8 w-8" />
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Inactive</p>
                                <p className="text-2xl font-bold">{stats.inactive}</p>
                            </div>
                            <UserX className="h-8 w-8" />
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Blocked</p>
                                <p className="text-2xl font-bold">{stats.blocked}</p>
                            </div>
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                    </Card>
                </div>

                <Card className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end">
                        <div className="flex-1">
                            <Label htmlFor="search" className="mb-2">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    name="search"
                                    placeholder="Search by name, email, or phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <Label htmlFor="filter" className="mb-2">User Type</Label>
                            <Select name="filter" value={filter} onValueChange={setFilter}>
                                <SelectTrigger id="filter">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full md:w-48">
                            <Label htmlFor="statusFilter" className="mb-2">Status</Label>
                            <Select name="status" value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger id="statusFilter">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="block">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleClearFilters}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden md:table-cell">Email</TableHead>
                                <TableHead className="hidden sm:table-cell">Type</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <UserRoundPlus className="mb-3 h-12 w-12 opacity-50" />
                                            <p className="text-lg font-medium">No users found</p>
                                            <p className="text-sm">Try adjusting your search or add a new user</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{user.name}</span>
                                                <span className="md:hidden text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <span className="text-sm">{user.email}</span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <RoleBadge usertype={user.user_type} />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <StatusBadge status={user.status} />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px]">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/user/${user.id}`} className="cursor-pointer">
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/user/${user.id}/edit`} className="cursor-pointer">
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    
                                                    {user.user_type === 'owner' && user.status === 'inactive' && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <DropdownMenuItem 
                                                                        onSelect={(e) => e.preventDefault()} 
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Approve Owner Account</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to approve <strong>{user.name}</strong> as an owner? 
                                                                            They will be able to log in and access the owner dashboard.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            onClick={() => handleApprove(user.id)}
                                                                        >
                                                                            Approve
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </>
                                                    )}
                                                    
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem 
                                                                onSelect={(e) => e.preventDefault()} 
                                                                className="cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone and will permanently remove their data from the servers.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(user.id)}
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">{users.from}</span> to{' '}
                            <span className="font-medium">{users.to}</span> of{' '}
                            <span className="font-medium">{users.total}</span> results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                disabled={users.current_page === 1}
                                onClick={() => handlePageChange(users.current_page - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                disabled={users.current_page === users.last_page}
                                onClick={() => handlePageChange(users.current_page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
}