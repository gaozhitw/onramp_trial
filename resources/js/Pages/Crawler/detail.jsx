import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import {Head, router} from "@inertiajs/react";
import _ from 'lodash';
import hljs from 'highlight.js';
import 'highlight.js/styles/vs2015.css';
import moment from "moment";

const Detail = ({ page }) => {
    const handleBack = () => {
        window.history.back();
    }

    useEffect(() => {
        let el = document.querySelector('pre code');
        el.innerHTML = page.body;
        hljs.highlightElement(el);
    }, []);

    const [screenshot, setScreenshot] = useState(page.screenshot_800x600);
    const handleShowLargeScreenshot = (e) => {
        if (screenshot === page.screenshot_800x600) {
            setScreenshot(page.screenshot);
        } else {
            setScreenshot(page.screenshot_800x600)
        }
    }

    return (
        <>
            <Head>
                <title>{page.title}</title>
            </Head>
            <div className="container dark:text-gray-300">
                <div className="flex justify-center items-center mt-10">
                    <div className="flex justify-start items-center w-1/2 cursor-pointer" onClick={handleBack}>
                        <div>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                            </svg>
                        </div>
                        <h1 className="ml-6 text-3xl">{page.title}</h1>
                    </div>
                </div>
                <div className="flex justify-center mt-6">
                    <img src={screenshot} className={`rounded ${screenshot === page.screenshot_800x600 ? 'cursor-zoom-in' : 'cursor-zoom-out'}`} alt="screenshot" onClick={handleShowLargeScreenshot}/>
                </div>
                <div className="flex justify-start justify-items-center mt-6 mr-auto ml-auto w-1/2">
                    <div>
                        <h2 className="font-bold text-2xl underline"><a href={page.url}>{page.title}</a></h2>
                        <div className="text-sm mt-1">{moment(page.created_at).fromNow()} <span className="text-xs">({moment(page.created_at).format('YYYY-MM-DD HH:mm:ss')})</span></div>
                        <p className="mt-3">{page.description}</p>
                    </div>
                </div>
                <div className="flex justify-start justify-items-center mt-6 mr-auto ml-auto w-1/2 mb-10">
                    <pre className="w-full text-xs">
                        <code className="language-html">
                        </code>
                    </pre>
                </div>
            </div>
        </>
    )
}

Detail.layout = page => <Layout children={page} />

export default Detail;
