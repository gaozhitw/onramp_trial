import React, { useState } from 'react';
import Layout from '../Layout';
import { Head, router } from '@inertiajs/react';
import Pagination from "../../components/Pagination.jsx";
import axios from "axios";
import moment from "moment";

const Index = ({ pages }) => {
    const [url, setUrl] = useState('');
    const handleInput = (e) => {
        setUrl(e.target.value);
    }

    const [disabled, setDisabled] = useState(false);
    const [hasError, setHasError] = useState(false);
    const handleSubmit = (e) => {
        if (url === '') {
            setHasError(true);
            return;
        }
        if (typeof window.URL !== "undefined") {
            try {
                new URL(url);
            } catch (e) {
                setHasError(true);
                return;
            }
        }
        setDisabled(true);
        setHasError(false);
        axios.post('/api/fetch', {
            url: url
        }).then((response) => {
            setDisabled(false);
            if (response.status === 201) {
                router.reload({ only: ['pages'] });
                setUrl('');
            }
        }).catch((error) => {
            setDisabled(false);
            setUrl('');
            setHasError(true);
            console.error(error);
        });
    }
    const handleVisitDetail = (e, id) => {
        if (typeof e.target.href === 'undefined') {
            router.visit('/detail/' + id);
        }
    }

    const handleVisitSource = (e) => {
        e.preventDefault();
        window.location = e.target.href;
    }

    const handlePrevPage = (e) => {
        e.preventDefault();
        if (pages.prev_page_url !== null) {
            router.visit(pages.prev_page_url);
        }
    }

    const handleNextPage = (e) => {
        e.preventDefault();
        if (pages.next_page_url !== null) {
            router.visit(pages.next_page_url);
        }
    }

    const handleChangePage = (e, page) => {
        e.preventDefault();
        if (page !== pages.current_page) {
            router.visit('/?page=' + page);
        }
    }

    return (
        <>
            <Head>
                <title>Web Crawler</title>
            </Head>
            <div className="flex justify-center mt-12">
                <input type="text" className={`border border-gray-400 p-2 w-1/3 rounded disabled:bg-gray-300 ${hasError ? 'border-2 border-red-600 bg-red-200' : ''}`} value={url} onInput={handleInput} placeholder="http(s)://example.com" disabled={disabled} />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-1 disabled:bg-blue-300" onClick={handleSubmit} disabled={disabled}>
                    {disabled ? (
                        <>
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                            </svg>Crawling...
                        </>
                    ) : 'Submit'}

                </button>
            </div>
            <div className="container">
                {pages.data.map((page) => {
                    return (
                        <div key={page.id} className="flex justify-center mt-10 dark:text-gray-300">
                            <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-3 ring-1 ring-slate-900/5 shadow-xl w-1/2 border-2 border-gray-100 dark:border-slate-700 dark:hover:border-slate-500 hover:border-amber-200 cursor-pointer" onClick={(e) => handleVisitDetail(e, page.id)}>
                                <div className="flex justify-start items-center">
                                    <div className="w-3/12">
                                        <img src={page.screenshot_200x150} className="rounded w-full" alt={page.title} />
                                    </div>
                                    <div className="ml-6 w-9/12">
                                        <h1 className="text-2xl font-bold"><a href={page.url} onClick={handleVisitSource}>{page.title}</a></h1>
                                        <hr className="mt-1.5 mb-1.5" />
                                        <p>{page.description}</p>
                                        <div className="flex justify-end text-xs mt-2"><span>{moment(page.created_at).fromNow()}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {pages.data.length > 0 && (
                    <div className="flex justify-center mt-10 mb-5">
                        <Pagination pages={pages} onNextPage={handleNextPage} onPrevPage={handlePrevPage} onChangePage={handleChangePage} />
                    </div>
                )}
            </div>
        </>
    )
}

Index.layout = page => <Layout children={page} />;

export default Index;
