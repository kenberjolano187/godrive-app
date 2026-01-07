import { useState, FormEvent, ChangeEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Upload, ArrowLeft, ArrowRight, Loader2, User, Mail, CreditCard, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; 

interface VerifyAccountProps {
    email?: string;
    token?: string;
    userType?: 'customer' | 'owner';
}

export default function VerifyAccount({ email: initialEmail, token, userType = 'owner' }: VerifyAccountProps) {
    const [step, setStep] = useState(1);
    const [previewId, setPreviewId] = useState<string | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        token: token || '',
        email: initialEmail || '',
        password: '',
        password_confirmation: '',
        firstname: '',
        lastname: '',
        gender: '',
        birthdate: '',
        age: '',
        phone_number: '',
        address: '',
        id_type: '',
        id_photo: null as File | null,
        photo: null as File | null,
        otp: '',
        user_type: userType,
        terms_accepted: false,
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('id_photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewId(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

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

    const handleBirthdateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const birthdate = e.target.value;
        setData('birthdate', birthdate);
        if (birthdate) {
            setData('age', calculateAge(birthdate));
        }
    };

    const sendOtp = async () => {
        setSendingOtp(true);
        try {
            await axios.post('/verification/account/send-otp', { 
                email: data.email,
                is_owner_registration: userType === 'owner'
            });
            setOtpSent(true);
            setOtpError('');
            setOtpVerified(false);
            
            toast.success('Verification code sent!', {
                description: `We sent a 6-digit code to ${data.email}`,
                id: `otp-sent-${Date.now()}`,
            });
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to send verification code';
            toast.error('Failed to send code', {
                description: errorMsg,
                id: `otp-error-${Date.now()}`,
            });
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOtp = async () => {
        setVerifyingOtp(true);
        setOtpError('');
        try {
            const response = await axios.post('/verification/account/verify-otp', {
                email: data.email,
                otp: data.otp
            });
            
            if (response.data.valid) {
                setOtpVerified(true);
                setStep(4);
                
                toast.success('Email verified!', {
                    description: 'You can now proceed to upload your ID',
                    id: `otp-verified-${Date.now()}`,
                });
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Invalid verification code';
            setOtpError(message);
            setOtpVerified(false);
            
            toast.error('Verification failed', {
                description: message,
                id: `verify-error-${Date.now()}`,
            });
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleNextStep = async (e: FormEvent) => {
        e.preventDefault();
        
        if (step === 1) {
            if (!data.email || !data.password || !data.password_confirmation) {
                toast.error('All fields are required');
                return;
            }
            if (data.password !== data.password_confirmation) {
                toast.error('Passwords do not match');
                return;
            }
            if (data.password.length < 8) {
                toast.error('Password must be at least 8 characters');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            if (!otpSent) {
                await sendOtp();
                return;
            }
            if (data.otp.length === 6) {
                await verifyOtp();
            }
        } else if (step === 4) {
            if (!data.id_photo || !data.id_type) return;
            setShowReviewModal(true);
        }
    };

    const handleSubmit = () => {
        if (!otpVerified) {
            setOtpError('Please verify your OTP first');
            toast.error('Verification required', {
                description: 'Please verify your OTP first',
                id: 'otp-required',
            });
            return;
        }
        
        post('/verification/account/verify', {
            forceFormData: true,
            onSuccess: () => setShowReviewModal(false),
        });
    };

    const stepsConfig = [
        { num: 1, icon: Lock, label: 'Account' },
        { num: 2, icon: User, label: 'Personal Info' },
        { num: 3, icon: Mail, label: 'Email & OTP' },
        { num: 4, icon: CreditCard, label: 'ID Upload' },
    ];

    return (
        <AuthLayout title="Get Started Today" description="Just 4 Easy Steps">
            <div className="mb-8 flex items-center justify-center gap-2">
                {stepsConfig.map((item) => (
                    <div key={item.num} className="flex items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${step >= item.num ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                            <item.icon className="h-5 w-5" />
                        </div>
                        {item.num !== 4 && (
                            <div className={`h-1 w-8 transition-colors duration-300 ${step > item.num ? 'bg-primary' : 'bg-muted'}`} />
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleNextStep} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                                id="email"
                                name="email"
                                type="email"
                                value={data.email} 
                                onChange={(e) => setData('email', e.target.value)} 
                                required 
                                placeholder="email@gmail.com"
                                autoComplete="email"
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input 
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password} 
                                    onChange={(e) => setData('password', e.target.value)} 
                                    required 
                                    placeholder="Enter your Password"
                                    autoComplete="new-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <div className="relative">
                                <Input 
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showPasswordConfirmation ? "text" : "password"}
                                    value={data.password_confirmation} 
                                    onChange={(e) => setData('password_confirmation', e.target.value)} 
                                    required 
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted">
                                    {previewPhoto ? (
                                        <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <label htmlFor="photo" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                                    <Camera className="h-4 w-4" />
                                    <input 
                                        type="file" 
                                        id="photo"
                                        name="photo"
                                        accept="image/*" 
                                        onChange={handlePhotoChange} 
                                        className="hidden"
                                        autoComplete="off" 
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="firstname">First Name</Label>
                                <Input 
                                    id="firstname" 
                                    name="firstname"
                                    value={data.firstname} 
                                    onChange={(e) => setData('firstname', e.target.value)} 
                                    required 
                                    placeholder="First Name"
                                    autoComplete="given-name" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input 
                                    id="lastname"
                                    name="lastname" 
                                    value={data.lastname} 
                                    onChange={(e) => setData('lastname', e.target.value)} 
                                    required 
                                    placeholder="Last Name"
                                    autoComplete="family-name" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="gender">Gender</Label>
                            <select 
                                id="gender"
                                name="gender" 
                                value={data.gender} 
                                onChange={(e) => setData('gender', e.target.value)} 
                                required 
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                autoComplete="off"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-1">
                                <Label htmlFor="birthdate">Date of Birth</Label>
                                <Input 
                                    id="birthdate"
                                    name="birthdate" 
                                    type="date" 
                                    value={data.birthdate} 
                                    onChange={handleBirthdateChange} 
                                    required
                                    autoComplete="off" 
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="age">Age</Label>
                                <Input 
                                    id="age"
                                    name="age" 
                                    value={data.age} 
                                    readOnly 
                                    className="bg-muted"
                                    autoComplete="off" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input 
                                id="phone_number"
                                name="phone_number" 
                                type="tel" 
                                value={data.phone_number} 
                                onChange={(e) => setData('phone_number', e.target.value)} 
                                required 
                                placeholder="09xxxxxxxxx"
                                autoComplete="tel" 
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="address">Address</Label>
                            <Textarea 
                                id="address"
                                name="address" 
                                value={data.address} 
                                onChange={(e) => setData('address', e.target.value)} 
                                required 
                                placeholder="Complete Address"
                                className="resize-none"
                                autoComplete="street-address"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            {!otpSent ? (
                                <>
                                    <Label htmlFor="email_display" className="text-center block">
                                        Email Address
                                    </Label>
                                    <Input 
                                        id="email_display"
                                        name="email_display" 
                                        type="email"
                                        value={data.email} 
                                        readOnly 
                                        className="bg-muted text-center"
                                        autoComplete="email" 
                                    />
                                </>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-center">Enter Verification Code</p>
                                    <div className="flex justify-center">
                                        <InputOTP 
                                            id="otp"
                                            name="otp"
                                            maxLength={6} 
                                            value={data.otp}
                                            onChange={(value) => {
                                                setData('otp', value);
                                                setOtpError('');
                                                setOtpVerified(false);
                                            }}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    
                                    {otpError && (
                                        <p className="text-sm text-red-500 text-center">{otpError}</p>
                                    )}
                                    
                                    <p className="text-xs text-muted-foreground text-center">
                                        Sent to {data.email}
                                    </p>
                                </div>
                            )}
                        </div>

                        {!otpSent ? (
                            <Button type="submit" variant="secondary" disabled={sendingOtp} className="w-full">
                                {sendingOtp ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </Button>
                        ) : (
                            <Button 
                                type="button" 
                                variant="link" 
                                onClick={async () => {
                                    setOtpSent(false);
                                    setData('otp', '');
                                    setOtpError('');
                                    setOtpVerified(false);
                                    await sendOtp();
                                }} 
                                disabled={sendingOtp}
                                className="w-full"
                            >
                                Resend Code
                            </Button>
                        )}
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-1">
                            <Label htmlFor="id_type">ID Type</Label>
                            <select 
                                id="id_type"
                                name="id_type" 
                                value={data.id_type} 
                                onChange={(e) => setData('id_type', e.target.value)} 
                                required 
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                autoComplete="off"
                            >
                                <option value="">Select ID Type</option>
                                <option value="PRC ID">PRC ID</option>
                                <option value="Passport">Passport</option>
                                <option value="Driver's License">Driver's License</option>
                                <option value="National ID">National ID</option>
                                <option value="Voter's ID">Voter's ID</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm font-medium">ID Photo</p>
                            {previewId ? (
                                <div className="rounded-lg border overflow-hidden">
                                    <AspectRatio ratio={16 / 9}>
                                        <img src={previewId} alt="Preview" className="w-full h-full object-cover" />
                                        <Button type="button" variant="secondary" size="sm" className="absolute bottom-2 right-2" onClick={() => { setPreviewId(null); setData('id_photo', null); }}>Change</Button>
                                    </AspectRatio>
                                </div>
                            ) : (
                                <label htmlFor="id_photo" className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-sm text-muted-foreground">Click to upload ID</span>
                                    <input 
                                        type="file" 
                                        id="id_photo"
                                        name="id_photo"
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        required 
                                        className="hidden"
                                        autoComplete="off" 
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-6">
                    <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={() => {
                            if (step > 1) {
                                setStep(step - 1);
                                if (step === 3) {
                                    setOtpSent(false);
                                    setData('otp', '');
                                    setOtpError('');
                                    setOtpVerified(false);
                                }
                            } else {
                                window.history.back();
                            }
                        }} 
                        disabled={processing || verifyingOtp} 
                        className="w-12 h-10 flex items-center justify-center"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <Button 
                        type="submit" 
                        disabled={processing || verifyingOtp || (step === 3 && (!otpSent || data.otp.length < 6))} 
                        className={step === 4 ? "px-6 h-10 flex items-center gap-2" : "w-12 h-10 flex items-center justify-center"}
                    >
                        {(processing || verifyingOtp) ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : step === 4 ? (
                            <>
                                Check Details <ArrowRight className="h-4 w-4" />
                            </>
                        ) : (
                            <ArrowRight className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </form>

            <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Review Information</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col md:flex-row gap-8 py-4">
                        <div className="w-full md:w-3/5 space-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground text-[10px] uppercase font-bold">Email Address</p>
                                <p className="font-medium text-lg leading-tight">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-[10px] uppercase font-bold">Full Name</p>
                                <p className="font-medium text-lg leading-tight">{data.firstname} {data.lastname}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Gender</p>
                                    <p className="font-medium">{data.gender || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-[10px] uppercase font-bold">Birthdate</p>
                                    <p className="font-medium">{data.birthdate} ({data.age} yrs old)</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-[10px] uppercase font-bold">Phone Number</p>
                                <p className="font-medium">{data.phone_number}</p>
                            </div>
                            <div className="border-t pt-3">
                                <p className="text-muted-foreground text-[10px] uppercase font-bold">Complete Address</p>
                                <p className="font-medium leading-relaxed">{data.address}</p>
                            </div>
                        </div>

                        <div className="w-full md:w-2/5 space-y-6">
                            {previewPhoto && (
                                <div className="flex justify-center">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                                        <img src={previewPhoto} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <p className="text-muted-foreground text-[10px] uppercase font-bold">Uploaded ID ({data.id_type})</p>
                                <div className="rounded-lg overflow-hidden border bg-zinc-900 shadow-md">
                                    <AspectRatio ratio={16 / 9}>
                                        {previewId && (
                                            <img 
                                                src={previewId} 
                                                alt="ID Preview" 
                                                className="w-full h-full object-contain" 
                                            />
                                        )}
                                    </AspectRatio>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                            <Switch 
                                id="terms"
                                name="terms"
                                checked={data.terms_accepted} 
                                onCheckedChange={(checked) => setData('terms_accepted', checked)} 
                            />
                            <label htmlFor="terms" className="text-[11px] text-muted-foreground leading-tight cursor-pointer flex-1">
                                I confirm that all information provided is true and I agree to the terms and conditions.
                            </label>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={!data.terms_accepted || processing} className="px-10">
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm & Submit
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </AuthLayout>
    );
}