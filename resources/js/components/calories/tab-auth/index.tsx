import TextLink from '@/components/text-link';
import React from 'react';
const TabsAuth: React.FC<{ active: 'login' | 'register' }> = ({ active }) => {
    return (
        <div className="flex w-full gap-2 rounded-full bg-gray-100 p-1">
            <TextLink href={route('login')} className="w-full">
                <button
                    className={
                        'w-full cursor-pointer rounded-full px-4 py-2 font-medium text-black shadow-sm transition hover:bg-gray-100 hover:shadow-md' +
                        (active === 'login' ? ' bg-white shadow-md' : ' bg-gray-100')
                    }
                >
                    Sign In
                </button>
            </TextLink>
            <TextLink href={route('register')} className="w-full">
                <button
                    className={
                        'w-full cursor-pointer rounded-full px-4 py-2 font-medium text-gray-500 transition hover:bg-gray-200 hover:text-black' +
                        (active === 'register' ? ' bg-white text-black shadow-md' : ' bg-gray-100 text-gray-500')
                    }
                >
                    Sign Up
                </button>
            </TextLink>
        </div>
    );
};

export default TabsAuth;
