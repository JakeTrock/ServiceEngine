import * as React from "react";
import './data/styles.css';

const AboutPage = () => {
    return (
        <>
            <h3>The internet is a trove of tools, but many of these tools have been plagued by a recurring set of issues, namely, them being ad-infested, slow, buggy, non-intuitive, a security risk and myriad other issues.</h3>

            <br />
            <h4>SEngine's here to fix that.</h4>

            We are building a platform on the cutting-edge WASM language that is being adopted by browsers to deliver secure, intuitive client side applications.

            SEngine is still in development, but when finished, its interface builder and wasm compiler will allow you to cobble together a gui that will work on the majority of browsers, and write a script to power it in a variety of programming languages, all in a fraction in the time it'd take you to write it from scratch. Then you'll be able to share it
            to our community.

            You'll also be able to share settings within it so when a friend asks "how do I make these images of my dog into a purple tinted gif with glitter?", you'll go from a grueling 2 hour video help call to a
            "try this".

            Want to know more? check out our <a href="https://docs.google.com/presentation/d/1HBWE3047SEUFIb9vOd80FbWwX-CvWS8ymPlEQQ_Ctng/edit?usp=sharing">pitch deck</a>

            We were so privelaged and proud to be part of the <a href="https://hopin.com/events/demodayspring2021#booths">2021 husky startup challenge</a> thrown by the <a href="https://www.nuentrepreneursclub.com/">Northeastern University Entrepreneurs Club</a>

            You can see us pitching for eclub <a href="https://www.youtube.com/watch?v=H2Ixo4KpV8E">here</a>, but I'll just make it easy for you by putting our clip <a href="./pitch.webm">here</a>.
        </>
    );
};

export default AboutPage;
