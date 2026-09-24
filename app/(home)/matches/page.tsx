import MatchBox from '@/components/ui/matchBox';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getMatches, displayScore } from '@/lib/data';
import { formatDate, formatTime } from '@/lib/format';

export const metadata = {
	title: 'Rozgrywki | Pretty Boys',
};

export default async function MatchesPage() {
	const matches = await getMatches();
	const played = [...matches].filter((m) => m.ourScore !== null).reverse();
	const upcoming = matches.filter((m) => m.ourScore === null);

	return (
		<Section>
			<Wrapper>
				<h1 className='text-3xl font-bold text-white mb-10 lg:text-4xl'>
					Rozgrywki
				</h1>

				{upcoming.length > 0 && (
					<>
						<h2 className='text-2xl font-bold text-pink-400 mb-4'>
							Nadchodzące mecze
						</h2>
						<div className='grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3'>
							{upcoming.map((m) => (
								<MatchBox
									key={m.id}
									title={m.round ?? m.matchType}
									date={formatDate(m.date)}
									round={formatTime(m.date)}
									opponent={m.opponent}
									home={m.home}
								/>
							))}
						</div>
					</>
				)}

				{played.length > 0 && (
					<>
						<h2 className='text-2xl font-bold text-pink-400 mb-4'>
							Rozegrane mecze
						</h2>
						<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
							{played.map((m) => (
								<MatchBox
									key={m.id}
									title={m.round ?? m.matchType}
									date={formatDate(m.date)}
									round={m.home ? 'Dom' : 'Wyjazd'}
									opponent={m.opponent}
									home={m.home}
									score={displayScore(m)}
								/>
							))}
						</div>
					</>
				)}

				{matches.length === 0 && (
					<p className='text-white'>Brak zaplanowanych meczów.</p>
				)}
			</Wrapper>
		</Section>
	);
}
