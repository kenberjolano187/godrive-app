import SidebarLayout from '@/layouts/sidebar-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Edit, 
    Calendar, 
    Mail, 
    Phone,
    User as UserIcon,
    Shield,
    Clock,
    MapPin,
    Users,
    CreditCard,
    ImageIcon
} from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { getImageUrl, getUserInitials } from '@/lib/image-helpers';

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
    birthdate: string | null;
    age: number | null;
    phone_number: string | null;
    address: string | null;
    id_type: string | null;
    id_photo: string | null;
    photo: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
}

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
        <Badge variant={variant} className="text-sm">
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
        <Badge variant={variant} className="text-sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
    );
};

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function UserShow({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'View User',
            href: '/user',
        },
    ];

    // Get image URLs using helper
    const photoUrl = getImageUrl(user.photo);
    const idPhotoUrl = getImageUrl(user.id_photo);
    const userInitials = getUserInitials(user.firstname, user.lastname);

    return (
        <SidebarLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild>
                            <Link href="/user">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="p-6">
                    <div className="flex items-start gap-6 pb-6 border-b">
                        <div className="flex-shrink-0">
                            {photoUrl ? (
                                <img 
                                    src={photoUrl}
                                    alt={user.name}
                                    className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                                />
                            ) : (
                                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <span className="text-2xl font-semibold text-muted-foreground">
                                        {userInitials}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground mt-1">{user.email}</p>
                            <div className="flex gap-2 mt-3">
                                <RoleBadge usertype={user.user_type} />
                                <StatusBadge status={user.status} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 pt-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                First Name
                            </label>
                            <p className="text-base font-medium">{user.firstname}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Last Name
                            </label>
                            <p className="text-base font-medium">{user.lastname}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Email Address
                            </label>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <p className="text-base font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Phone Number
                            </label>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <p className="text-base font-medium">
                                    {user.phone_number || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Gender
                            </label>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <p className="text-base font-medium capitalize">{user.gender}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Birthdate
                            </label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-base font-medium">
                                    {formatDate(user.birthdate)}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Age
                            </label>
                            <p className="text-base font-medium">
                                {user.age ? `${user.age} years old` : 'N/A'}
                            </p>
                        </div>

                        {user.address && (
                            <div className="space-y-2 md:col-span-2 lg:col-span-3">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="text-base font-medium">{user.address}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ID Information Section */}
                    {(user.id_type || user.id_photo) && (
                        <div className="border-t mt-6 pt-6">
                            <h3 className="text-lg font-semibold mb-4">ID Information</h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                {user.id_type && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            ID Type
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-base font-medium">{user.id_type}</p>
                                        </div>
                                    </div>
                                )}

                                {idPhotoUrl && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            ID Photo
                                        </label>
                                        <div className="mt-2">
                                            <img 
                                                src={idPhotoUrl}
                                                alt="ID Document"
                                                className="h-40 w-auto object-cover border-2 border-gray-200 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Account Information Section */}
                    <div className="border-t mt-6 pt-6">
                        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    User Type
                                </label>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <RoleBadge usertype={user.user_type} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">
                                    Account Status
                                </label>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <StatusBadge status={user.status} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </SidebarLayout>
    );
}