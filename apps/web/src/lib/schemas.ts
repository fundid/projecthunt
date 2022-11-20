import { z } from 'zod';
import { zfd } from 'zod-form-data';
const imageTypes = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
	'image/svg+xml',
	'image/gif'
];

export const createProjectDto = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(1, { message: 'Name is required' })
		.max(40, { message: 'Name must be 40 characters or less' })
		.trim(),
	tagline: z
		.string({ required_error: 'Tagline is required' })
		.min(1, { message: 'Tagline is required' })
		.max(60, { message: 'Tagline must be 60 characters or less' })
		.trim(),
	url: z.string({ required_error: 'URL is required' }).url({ message: 'URL must be a valid URL.' }),
	description: z
		.string({ required_error: 'Description is required' })
		.min(1, { message: 'Description is required' })
		.max(240, { message: 'Description must be less than 240 characters' })
		.trim(),
	thumbnail: z
		.instanceof(Blob)
		.optional()
		.superRefine((val, ctx) => {
			if (val) {
				if (val.size < 10000 || val.size > 2000000) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Thumbnail must be between 10KB & 2MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Unsupported file type. Supported formats: jpeg, jpg, png, web, svg, gif'"
					});
				}
			}
		}),
	user: z.string().optional()
});

export const updateProjectTags = zfd.formData(
	z.object({
		technologies: zfd.repeatableOfType(z.string()),
		topics: zfd.repeatableOfType(z.string())
	})
);

export const updateProjectImagesDto = zfd.formData({
	images: zfd.repeatableOfType(
		z.instanceof(Blob).superRefine((val, ctx) => {
			if (val) {
				if (val.size < 10000 || val.size > 2000000) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Images must be between 10KB & 2MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Unsupported file type. Supported formats: jpeg, jpg, png, web, svg, gif'"
					});
				}
			}
		})
	)
});

export const createCommentDto = z.object({
	content: z
		.string({ required_error: 'Content is required' })
		.min(2, { message: 'Comment must be at least 2 characters' })
		.max(240, { message: 'Comment must be less than 241 characters' })
		.trim(),
	project: z.string({ required_error: 'Project is required' }),
	user: z.string({ required_error: 'User is required' }),
	parentId: z.string().optional()
});

export const updateCommentDto = z.object({
	id: z.string({ required_error: 'An ID must be passed with the comment to update it' }),
	content: z
		.string({ required_error: 'Content is required' })
		.min(2, { message: 'Comment must be at least 2 characters' })
		.max(240, { message: 'Comment must be less than 241 characters' })
		.trim()
});

export const createReplyDto = z.object({
	content: z
		.string({ required_error: 'Content is required' })
		.min(2, { message: 'Comment must be at least 2 characters' })
		.max(240, { message: 'Comment must be less than 241 characters' })
		.trim(),
	comment: z.string(),
	reply: z.string()
});

export const loginUserDto = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Email must be a valid email.' }),
	password: z.string({ required_error: 'Password is required' })
});

export const registerUserDto = z
	.object({
		name: z
			.string({ required_error: 'Name is required.' })
			.regex(/^[a-zA-Z\s]*$/, { message: 'Name can only contain letters and spaces.' })
			.min(2, { message: 'Name must be at least 2 characters' })
			.max(64, { message: 'Name must be less than 64 characters' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Email must be a valid email.' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' }),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['passwordConfirm']
			});
		}
	});

export const updateUserProfileDto = z.object({
	name: z
		.string({ required_error: 'Name is required.' })
		.min(2, { message: 'Name must be at least 2 characters' })
		.max(64, { message: 'Name must be less than 64 characters' })
		.trim()
		.optional(),
	avatar: z
		.instanceof(Blob)
		.optional()
		.superRefine((val, ctx) => {
			if (val) {
				if (val.size < 10000 || val.size > 2000000) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Avatar must be between 10KB & 2MB'
					});
				}

				if (!imageTypes.includes(val.type)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: "Unsupported file type. Supported formats: jpeg, jpg, png, web, svg, gif'"
					});
				}
			}
		}),
	bio: z
		.string({ required_error: 'Bio is required.' })
		.min(2, { message: 'Bio must be at least 2 characters' })
		.max(512, { message: 'Bio must be less than 512 characters' })
		.trim()
		.optional()
		.or(z.literal('').optional()),
	website: z
		.string({ required_error: 'Website is required.' })
		.url({ message: 'Website must be a valid URL' })
		.min(2, { message: 'Bio must be at least 2 characters' })
		.max(96, { message: 'Bio must be less than 512 characters' })
		.trim()
		.optional()
		.or(z.literal('').optional()),
	twitter: z
		.string({ required_error: 'Twitter is required.' })
		.url({ message: 'Twitter must be a valid URL' })
		.min(2, { message: 'Bio must be at least 2 characters' })
		.max(96, { message: 'Bio must be less than 512 characters' })
		.trim()
		.optional()
		.or(z.literal('').optional()),
	youtube: z
		.string({ required_error: 'YouTube is required.' })
		.url({ message: 'YouTube must be a valid URL' })
		.min(2, { message: 'Bio must be at least 2 characters' })
		.max(96, { message: 'Bio must be less than 512 characters' })
		.trim()
		.optional()
		.or(z.literal('').optional()),
	github: z
		.string({ required_error: 'GitHub is required.' })
		.url({ message: 'GitHub must be a valid URL' })
		.min(2, { message: 'Bio must be at least 2 characters' })
		.max(96, { message: 'Bio must be less than 512 characters' })
		.trim()
		.optional()
		.or(z.literal('').optional())
});

export const updateUsernameDto = z.object({
	username: z
		.string({ required_error: 'Username is required.' })
		.min(3, { message: 'Username is too short (minimum is 3 characters)' })
		.max(24, { message: 'Username is too long (maximum is 24 characters)' })
		.trim()
});

export const updateEmailDto = loginUserDto.pick({ email: true });

export const resetPasswordDto = loginUserDto.pick({ email: true });

export const updatePasswordDto = z
	.object({
		oldPassword: z
			.string({ required_error: 'Current password is required.' })
			.min(6, { message: 'Passwords must be at least 2 characters' })
			.max(64, { message: 'Passwords must be less than 64 characters' })
			.trim(),
		password: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' }),
		passwordConfirm: z
			.string({ required_error: 'Password is required' })
			.min(6, { message: 'Password must be at least 6 characters' })
			.max(64, { message: 'Password must be less than 64 characters' })
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'New Password and Confirm New Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'New Password and Confirm New Password must match',
				path: ['passwordConfirm']
			});
		}
	});

export type registerUserErrors = z.inferFlattenedErrors<typeof registerUserDto>;
