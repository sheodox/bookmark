import { apiPath } from './state/api';

export default function Footer() {
	const links = [
		{
			text: 'Logout',
			href: apiPath('/api/auth/logout'),
		},
		{
			text: '©2022 sheodox',
			href: 'https://github.com/sheodox',
		},
	];
	return (
		<footer className="text-center p-4">
			<nav>
				<ul className="flex justify-center gap-6">
					{links.map((link) => {
						return (
							<li key={link.href}>
								<a href={link.href} className="font-bold border-b-4 border-transparent hover:border-sky-400">
									{link.text}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</footer>
	);
}
