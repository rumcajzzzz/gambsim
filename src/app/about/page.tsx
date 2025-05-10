import "@styles/about.css";
import "@styles/socketclient.css";

export default function About() {
  return (
    <main className="about-page px-6 py-12 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-10 text-center">About & How to Play</h1>

      {/* About Sections */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold m-4">🚧 Work In Progress</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          While the core gameplay is fully functional, we're actively improving the experience. 
          Current limitations include mobile responsiveness optimizations, additional game modes, 
          and enhanced accessibility features. We're committed to regular updates—your feedback 
          helps shape the roadmap!
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-400">
          <li className="mb-2">📱 Mobile interface refinements in progress</li>
          <li className="mb-2">🌐 Global chat for players</li>
          <li className="mb-2">And many more...</li>
        </ul>
      </section>

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
        <h2 className="text-2xl font-semibold m-4">⚙️ Real-Time Multiplayer Tech</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          Built with Next.js, Socket.IO, and MongoDB, this project ensures fast updates and
          shared game state between players. Every action is synchronized in real-time,
          creating a seamless multiplayer experience without page reloads.
        </p>
      </section>

      {/* How to Play Sections */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold m-4">🎮 How to Play</h2>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h3 className="text-xl font-medium mb-3 text-green-400">Basic Rules</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Choose between <span className="text-red-400">Red</span>, <span className="text-black">Black</span>, or <span className="text-green-400">Green</span></li>
            <li>Place your bet amount using the controls</li>
            <li>Wait for the countdown to complete</li>
            <li>Watch the wheel spin and see if you win!</li>
          </ul>
        </div>
      </section>

      <section className="mb-16">
        <h3 className="text-xl font-medium mb-3 text-yellow-400">Betting System</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Payouts:</h4>
            <ul className="space-y-1">
              <li>🔴 Red: 2x your bet</li>
              <li>⚫ Black: 2x your bet</li>
              <li>🟢 Green: 14x your bet</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Quick Controls:</h4>
            <ul className="space-y-1">
              <li>+10 / +100 / +1000: Quick bet increments</li>
              <li>1/2: Halve your current bet</li>
              <li>2x: Double your current bet</li>
              <li>MAX: Bet your entire balance</li>
            </ul>
          </div>
        </div>
      </section>
	   <section className="mb-16">
			<h2 className="text-2xl font-semibold m-4">⛽ Refuel System</h2>
			<div className="bg-gray-800/50 p-6 rounded-lg">
				<p className="text-lg leading-relaxed text-gray-300 mb-4">
				Our current refuel system provides players with an automatic balance boost when they run low:
				</p>
				
				<div className="grid md:grid-cols-2 gap-6">
				<div>
					<h3 className="text-xl font-medium mb-3 text-green-400">Current Features</h3>
					<ul className="list-disc list-inside space-y-2 text-gray-300">
					<li>Automatically refuels between <span className="font-bold">0 to 1000 points</span> when balance is low</li>
					<li>Triggered during the waiting phase</li>
					<li>Instant balance update with no gameplay interruption</li>
					<li>Visual indicator when refuel is available</li>
					</ul>
				</div>
				
				<div>
					<h3 className="text-xl font-medium mb-3 text-yellow-400">Coming Soon</h3>
					<ul className="list-disc list-inside space-y-2 text-gray-300">
					<li>Customizable refuel amounts based on player level</li>
					<li>Daily bonus refuels for returning players</li>
					<li>Option to bank unused refuels for later</li>
					</ul>
				</div>
				</div>

				<div className="mt-6 p-4 bg-gray-700/30 rounded border-l-4 border-yellow-500">
				<p className="text-yellow-300 italic">
					"The refuel system is designed to keep players in the action while we develop more robust progression systems. Your feedback will help shape its evolution!"
				</p>
				</div>
			</div>
	  </section>
      <section className="mb-16">
        <h3 className="text-xl font-medium mb-3 text-blue-400">Game Phases</h3>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <div className="flex flex-col space-y-4">
            <div>
              <span className="font-semibold text-gray-200">Waiting Phase (20s):</span>
              <p className="text-gray-300">Place your bets during this time</p>
            </div>
            <div>
              <span className="font-semibold text-red-500">Rolling Phase:</span>
              <p className="text-gray-300">Watch the wheel spin - no bets can be placed</p>
            </div>
            <div>
              <span className="font-semibold text-green-500">Result Phase:</span>
              <p className="text-gray-300">See if you won and collect your payout</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}