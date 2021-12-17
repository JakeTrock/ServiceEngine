import * as React from "react";
import twoWay from './images/2way.png';



const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:mx-auto">
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">

                            <h1 className="text-3xl font-semibold text-gray-800 md:text-4xl">About SEngine</h1><br />

                            <h3 className="text-gray-800 md:text-2xl">The internet is a trove of tools, but many of these tools have been plagued by a recurring set of issues, namely, them being ad-infested, slow, buggy, non-intuitive, a security risk and myriad other issues.</h3>
                            <img src={twoWay} alt="It's a metaphor" />
                            <br />
                            <h4 className="font-semibold text-gray-800 md:text-2xl">SEngine's here to fix that.</h4><br />

                            We are building a platform on the cutting-edge WASM language that is being adopted by browsers to deliver secure, intuitive client side applications.<br />

                            SEngine is still in development, but when finished, its interface builder and wasm compiler will allow you to cobble together a gui that will work on the majority of browsers, and write a script to power it in an intuitive language, all in a fraction in the time it'd take you to write it from scratch. Then you'll be able to share it to our community. We want to foster a two-way relationship between developers and nonprogrammers that will finally bridge the productivity gap between those that know and those that don't.<br />

                            You'll also be able to share settings within it so when a friend asks "how do I make a video slideshow of my trip from these photos?", you'll go from a grueling 2 hour video help call to a "try this".<br />

                            Want to know more? check out our <a className="text-indigo-600" href="https://docs.google.com/presentation/d/1HBWE3047SEUFIb9vOd80FbWwX-CvWS8ymPlEQQ_Ctng/edit?usp=sharing">pitch deck</a><br />

                            We were so privelaged and proud to be part of the <a className="text-indigo-600" href="https://hopin.com/events/demodayspring2021#booths">2021 husky startup challenge</a> thrown by the <a className="text-indigo-600" href="https://www.nuentrepreneursclub.com/">Northeastern University Entrepreneurs Club</a><br />

                            You can see us pitching for eclub <a className="text-indigo-600" href="https://www.youtube.com/watch?v=H2Ixo4KpV8E">here</a>, but I'll just make it easy for you by putting our clip <a className="text-indigo-600" href="https://sengineorg.github.io/pitch.webm">here</a>.<br />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AboutPage;
