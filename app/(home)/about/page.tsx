import Section from '@/components/ui/section';
import Wrapper from '@/components/wrapper';

export const metadata = {
	title: 'O Klubie | Pretty Boys',
};

export default function AboutPage() {
	return (
		<Section>
			<Wrapper>
				<h1 className='text-3xl font-bold text-white mb-10 lg:text-4xl'>
					O Klubie
				</h1>

				<div className='flex flex-col gap-6 text-zinc-200 leading-relaxed max-w-3xl'>
					<p>
						Pretty Boys to amatorski klub piłkarski, który łączy pasjonatów futbolu
						chcących rywalizować na wysokim poziomie, jednocześnie zachowując
						przyjazną atmosferę drużyny grającej dla samej radości gry.
					</p>
					<p>
						Trenujemy systematycznie, walczymy o jak najwyższe miejsce w tabeli
						ligowej i staramy się reprezentować nasze barwy z jak największym
						zaangażowaniem w każdym meczu.
					</p>
					<p>
						Dołącz do nas na trybunach — każdy doping się liczy!
					</p>
				</div>
			</Wrapper>
		</Section>
	);
}
