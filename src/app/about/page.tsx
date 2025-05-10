import "@styles/about.css"
import "@styles/socketclient.css";

export default function About() {
	return (
	  <main className="about-page px-6 py-12 max-w-4xl mx-auto text-white">
		<h1 className="text-4xl font-bold mb-10 text-center">About the Project</h1>
  
		<section className="mb-16">
		  <h2 className="text-2xl font-semibold m-4">🎯 Our Mission</h2>
		  <p className="text-lg leading-relaxed text-gray-300">
			This project started as a passion-driven idea to combine interactive game design
			with real-time multiplayer capabilities. Our mission is to deliver a fun, fast-paced
			experience that anyone can enjoy—whether you're here for competition, creativity,
			or casual play.
		  </p>
		</section>
  
		<section className="mb-16">
		  <h2 className="text-2xl font-semibold m-4">🎮 The Game Experience</h2>
		  <p className="text-lg leading-relaxed text-gray-300">
			Players can place bets, roll the dice, and watch live results in a dynamic interface.
			The animations, betting system, and leaderboards are designed to feel responsive
			and engaging across all devices. We aim for simplicity without sacrificing depth.
		  </p>
		</section>
  
		<section className="mb-16">
		  <h2 className="text-2xl font-semibold m-4">⚙️ Real-Time Multiplayer Tech</h2>
		  <p className="text-lg leading-relaxed text-gray-300">
			Built with Next.js, Socket.IO, and MongoDB, this project ensures fast updates and
			shared game state between players. Every action is synchronized in real-time,
			creating a seamless multiplayer experience without page reloads.
		  </p>
		</section>
	  </main>
	);
  }
  