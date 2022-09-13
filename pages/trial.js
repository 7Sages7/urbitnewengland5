import { useState, useEffect } from 'react';
import Head from "next/head";
import Link from 'next/link';
import Meta from "../components/Meta";
import {
  Container,
  SingleColumn,
  Section,
  IntraNav,
} from "@urbit/foundation-design-system";
import Header from "../components/Header";
import Footer from "../components/Footer";
import cn from 'classnames';

const postReq = (path, params, method = 'post') => {
  const form = document.createElement('form');
  form.method = method;
  form.action = path;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = key;
      hiddenField.value = params[key];

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}



export default function Trial(props) {
  const post = {
    title: "Explore the Network",
    description: "Get one week of a complimentary hosted comet: a temporary Urbit ID."
  };

  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('https://api.shore.arvo.network/count', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => {
        setCount(data.count);
      });
  }, []);

  const available = count > 0;

  return (
    <Container>
      <Head>
        <title>{post.title} • urbit.org</title>
        {Meta(post)}
      </Head>
      <IntraNav ourSite="https://urbit.org" search={props.search} />
      <SingleColumn>
        <Header />
        <Section className="space-y-12">
          <h1>{post.title}</h1>
          {/* Flex between image and blurb, collapse to col on mobile */}
          <div className="flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-4">
            <img className="max-w-lg h-auto w-full" src="https://media.urbit.org/site/getting-started/explore.png" />
            {/* Blurb is flexed to space button and copy */}
            <div className="flex-col flex space-y-4">
              <p>No downloads, no signup.</p>
              <p>Get <span className="font-bold">one week</span> of a complimentary hosted comet: a temporary Urbit ID.</p>
              {/* Button is flexed to space potential "try again later" copy */}
              <div className="space-x-4 flex items-center">
                <a className={cn("p-8 button-lg text-white max-w-fit", {
                  "bg-green-400": available,
                  "bg-wall-300 cursor-not-allowed": !available,
                })}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (!available) {
                      return
                    }

                    fetch('https://api.shore.arvo.network/enter', {
                      method: 'GET',
                      headers: { 'Content-Type': 'application/json' }
                    })
                      .then(res => {
                        if (!res.ok) {
                          throw 'Error response from shore api.';
                        }
                        return res.json();
                      })
                      .then(data => {
                        postReq(data.url + '/~/login', { password: data.code, redirect: '/' });
                      })
                      .catch(e => setCount(0));
                  }}
                >
                  {available ? 'Launch Comet' : 'No Comets Available'}
                </a>
                {!available && <p>Try back later!</p>}
              </div>
            </div>
          </div>
          <div className="max-w-prose flex flex-col space-y-4">
            <p>Comets are great for checking things out, but some groups may require a planet – a permanent Urbit ID.</p>
            <p>Learn more about <Link href="/getting-started/get-planet"><a>getting a planet</a></Link>.</p>
          </div>
        </Section>
      </SingleColumn>
      <Footer />
    </Container>
  );
}
