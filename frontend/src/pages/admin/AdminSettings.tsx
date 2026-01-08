import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormSchema } from '@/lib/schemas';
import type { ChangePasswordForm } from '@/lib/types';
import ChangePassword from '@/services/changePassword';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';

export default function AdminSettingsPage() {
	const { decoded } = useAuth();
	const { toast } = useToast();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Profile state
	const [profileData] = useState({
		name: decoded?.name || '',
		email: decoded?.email || '',
		phone_number: decoded?.phone_number || '',
	});

	const form = useForm<ChangePasswordForm>({
		resolver: zodResolver(ChangePasswordFormSchema),
		defaultValues: {
			id: decoded?.user_id || 0,
			old_password: '',
			new_password: '',
			confirm_password: '',
		},
	});

	const changePasswordMutation = useMutation({
		mutationFn: ChangePassword,
		onSuccess: () => {
			toast({
				variant: 'success',
				title: 'Success',
				description: 'Password changed successfully.',
			});
			form.reset({
				id: decoded?.user_id || 0,
				old_password: '',
				new_password: '',
				confirm_password: '',
			});
		},
		onError: (error: any) => {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error.message,
			});
		},
	});

	const onSubmit = (data: ChangePasswordForm) => {
		changePasswordMutation.mutate(data);
	};

	const onError = (error: any) => {
		toast({
			variant: 'destructive',
			title: 'Error',
			description: "New password and confirm password don't match",
		});
		console.log(error);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-foreground">Settings</h1>
				<p className="text-muted-foreground">
					Manage your account and security settings
				</p>
			</div>

			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="profile" className="gap-2">
						<User className="h-4 w-4" />
						Profile
					</TabsTrigger>
					<TabsTrigger value="security" className="gap-2">
						<Lock className="h-4 w-4" />
						Security
					</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Profile Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label className="text-muted-foreground">
										Full Name
									</Label>
									<Input
										value={profileData.name}
										disabled
										className="bg-muted"
									/>
									<p className="text-xs text-muted-foreground">
										Contact your super administrator to
										change your name
									</p>
								</div>

								<div className="space-y-2">
									<Label className="text-muted-foreground">
										Email Address
									</Label>
									<Input
										value={profileData.email}
										disabled
										className="bg-muted"
									/>
									<p className="text-xs text-muted-foreground">
										Contact your super administrator to
										change your email
									</p>
								</div>

								<div className="space-y-2">
									<Label className="text-muted-foreground">
										Phone Number
									</Label>
									<Input
										value={profileData.phone_number}
										disabled
										className="bg-muted"
									/>
									<p className="text-xs text-muted-foreground">
										Contact your super administrator to
										change your phone number
									</p>
								</div>

								<div className="space-y-2">
									<Label className="text-muted-foreground">
										Role
									</Label>
									<Input
										value="ADMIN"
										disabled
										className="bg-muted"
									/>
								</div>
							</div>

							<div className="border-t pt-6">
								<p className="text-sm text-muted-foreground">
									To update your profile information, please
									contact your super administrator.
								</p>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Security Tab */}
				<TabsContent value="security" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(
										onSubmit,
										onError,
									)}
									className="space-y-4"
								>
									<FormField
										control={form.control}
										name="old_password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Current Password
												</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															type={
																showOldPassword
																	? 'text'
																	: 'password'
															}
															placeholder="Enter your current password"
															{...field}
														/>
													</FormControl>
													<button
														type="button"
														onClick={() =>
															setShowOldPassword(
																!showOldPassword,
															)
														}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
													>
														{showOldPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="new_password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													New Password
												</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															type={
																showNewPassword
																	? 'text'
																	: 'password'
															}
															placeholder="Enter your new password"
															{...field}
														/>
													</FormControl>
													<button
														type="button"
														onClick={() =>
															setShowNewPassword(
																!showNewPassword,
															)
														}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
												<p className="text-xs text-muted-foreground">
													Password must be at least 2
													characters
												</p>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="confirm_password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>
													Confirm Password
												</FormLabel>
												<div className="relative">
													<FormControl>
														<Input
															type={
																showConfirmPassword
																	? 'text'
																	: 'password'
															}
															placeholder="Confirm your new password"
															{...field}
														/>
													</FormControl>
													<button
														type="button"
														onClick={() =>
															setShowConfirmPassword(
																!showConfirmPassword,
															)
														}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
													>
														{showConfirmPassword ? (
															<EyeOff className="h-4 w-4" />
														) : (
															<Eye className="h-4 w-4" />
														)}
													</button>
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="pt-4">
										<Button
											type="submit"
											disabled={
												changePasswordMutation.isPending
											}
											className="w-full sm:w-auto"
										>
											{changePasswordMutation.isPending
												? 'Changing Password...'
												: 'Change Password'}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>

					<Card className="border-blue-200 bg-blue-50">
						<CardHeader>
							<CardTitle className="text-sm text-blue-900">
								Security Tips
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-blue-800 space-y-2">
							<p>
								• Use a strong password with a mix of uppercase,
								lowercase, numbers, and symbols
							</p>
							<p>• Never share your password with anyone</p>
							<p>
								• Change your password regularly for better
								security
							</p>
							<p>
								• If you suspect your account has been
								compromised, contact your super administrator
								immediately
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
