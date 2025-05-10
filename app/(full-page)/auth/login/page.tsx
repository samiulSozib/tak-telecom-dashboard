'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useDispatch } from 'react-redux';
import { _login } from '../../../../app/redux/actions/authActions';
import { Toast } from 'primereact/toast';
import Swal from 'sweetalert2';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);


    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    // Load saved email from localStorage when component mounts
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savePassword=localStorage.getItem('rememberedPassword')
        if (savedEmail) {
            setEmail(savedEmail);
            setChecked(true);
        }
        if(savePassword){
            setPassword(savePassword)
            setChecked(true)
        }
    }, []);

    const handleLogin = async () => {
        setError(null);
        setLoading(true);

        try {
            const result = await dispatch<any>(_login(email, password,toast)); // Use the return value
            if (result.success) {
                if (checked) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword',password)
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                Swal.fire({
                    title: "Login Success!",
                    icon: "success",
                    draggable: true
                  });
                router.push('/'); // Navigate only on success


            } else {
                Swal.fire({
                    title: "Login Fail!",
                    icon: "error",
                    draggable: true
                  });
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            Swal.fire({
                title: "Login Fail!",
                icon: "error",
                draggable: true
              });
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img
                    src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
                    alt="Sakai logo"
                    className="mb-5 w-6rem flex-shrink-0"
                />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)',
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src="/layout/images/tak_telecom.jpeg" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Tak Telecom!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            {error && (
                                <div className="text-red-500 text-center mb-4">
                                    {error}
                                </div>
                            )}
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                id="email1"
                                type="text"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password
                                inputId="password1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                            />

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox
                                        inputId="rememberme1"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.checked ?? false)}
                                        className="mr-2"
                                    ></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a
                                    className="font-medium no-underline ml-2 text-right cursor-pointer"
                                    style={{ color: 'var(--primary-color)' }}
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Button
                                label={loading ? 'Signing In...' : 'Sign In'}
                                className="w-full p-3 text-xl"
                                onClick={() => handleLogin()}
                                disabled={loading}
                            ></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
