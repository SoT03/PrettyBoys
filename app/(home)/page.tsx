import Header from '@/components/header';
import LeagueStatsBox from '@/components/ui/leagueStatsBox';
import MatchBox from '@/components/ui/matchBox';
import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';
import { getLastMatch, getNextMatch, displayScore } from '@/lib/data';
import { formatDate } from '@/lib/format';

export default async function Home() {
	const [lastMatch, nextMatch] = await Promise.all([getLastMatch(), getNextMatch()]);

	return (
		<>
			<Header />
			<main>
				<Section>
					<Wrapper>
						<div className='grid  grid-rows-3 gap-6 md:gap-10 lg:grid-cols-2 lg:gap-14 2xl:grid-cols-3'>
							<MatchBox
								title='Ostatni mecz'
								date={lastMatch ? formatDate(lastMatch.date) : undefined}
								round={lastMatch?.round ?? undefined}
								opponent={lastMatch?.opponent}
								home={lastMatch?.home}
								score={lastMatch ? displayScore(lastMatch) : undefined}
							/>
							<MatchBox
								title='Następny mecz'
								date={nextMatch ? formatDate(nextMatch.date) : undefined}
								round={nextMatch?.round ?? undefined}
								opponent={nextMatch?.opponent}
								home={nextMatch?.home}
							/>
							<LeagueStatsBox />
						</div>
					</Wrapper>
				</Section>
			</main>
		</>
	);
}
