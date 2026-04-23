import React from 'react';
import { useRouteError, useNavigate } from 'react-router';

/**
 * Error Element Component
 * Displayed when a route throws an error
 */
const ErrorElement = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error('Route Error:', error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">
                    {error?.status === 404 ? '🔍' : '⚠️'}
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {error?.status === 404 ? 'Page Not Found' : 'Error'}
                </h1>
                
                <p className="text-gray-600 mb-2">
                    {error?.statusText || error?.message || 'Something went wrong'}
                </p>

                {process.env.NODE_ENV === 'development' && error?.data && (
                    <div className="mt-4 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                        <p className="text-xs font-mono text-red-800 break-words">
                            {error.data}
                        </p>
                    </div>
                )}

                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                    >
                        Go Home
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorElement;
