import polyphonicThumb from "./play_images/polyphonic.png"
import soundManThumb from "./play_images/soundman.png"
import forceAndMotionThumb from "./play_images/forceAndMotion.png"
import circuit from "./play_images/circuit.png"
//import gravitation from "./play_images/gravitation.png"
import pendulum from "./play_images/pendulum.png"

const gameMetaData = [
    {
        name: "polyphonic",
        url: "https://dacapo.io/polyphonic-pitch-detector/",
        primaryText: 'See Your Voice',
        description: "See your Pitch inside a Realtime Spectrogram",
        thumbnail: polyphonicThumb
    },
    {
        name: "circuitConstruction",
        url: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc-virtual-lab/latest/circuit-construction-kit-dc-virtual-lab_en.html",
        primaryText: 'Build your own circuits',
        description: "Build your own circuits",
        thumbnail: circuit
    },
    {
        name: "pendulum",
        url:"https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html",
        primaryText: 'Play with Pendulums',
        description: "Discover how the period of a simple pendulum depends on the length, mass, gravity, and the amplitude of the swing.",
        thumbnail: pendulum
    },
    {
        name: "gravitation",
        url: "https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab_en.html",
        primaryText: 'Play with the gravitational force that two objects exert on each other',
        description: "Play with the gravitational force that two objects exert on each other",
        thumbnail: "https://phet.colorado.edu/sims/html/gravity-force-lab/latest/gravity-force-lab-600.png"
    },
	{
        name: "Forces and Motion Basics",
        url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
        primaryText: 'Forces and Motion Basics',
        description: "Explore the forces at work when pulling against a cart, and pushing a " +
		"refrigerator, crate, or person. Create an applied force and see how it makes objects move. " +
		"Change friction and see how it affects the motion of objects.",
        thumbnail: forceAndMotionThumb
    },
    {
        name:"soundman",
    	url: "https://dacapo.io/soundman/",
        primaryText: 'Play Soundman with Your Voice',
        description: "Use your voice to catch flies and defeat Goblins",
        thumbnail: soundManThumb
    },
];

export default gameMetaData;