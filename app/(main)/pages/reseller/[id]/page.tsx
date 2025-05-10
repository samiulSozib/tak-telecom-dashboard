// pages/reseller/[id]/page.tsx
"use client"
import { _changeResellerPassword, _changeResellerPin, _getResellerById } from "@/app/redux/actions/resellerActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { AppDispatch } from "@/app/redux/store";
import withAuth from '../../../authGuard';
import { PrimeIcons } from 'primereact/api';
import * as Yup from 'yup';


import { TabPanel, TabView } from "primereact/tabview";
import { Card } from "primereact/card";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Toast } from "primereact/toast";


// import { useRouter } from "next/router";

interface ResellerDetailsPageProps {
    params: { id: string };
}

interface ValidationErrors  {
    new_password?: string;
    confirm_new_password?: string;
};

interface PINValidationErrors{
    new_pin?:string,
    confirm_new_pin?:string
}


const ResellerDetailsPage = ({params}: ResellerDetailsPageProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { singleReseller } = useSelector((state: any) => state.resellerReducer);
    //const {userInfo}=useSelector((state:any)=>state.authReducer)
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const {t}=useTranslation()
    const toast = useRef<Toast>(null);


    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showPinDialog, setShowPinDialog] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        new_password: '',
        confirm_new_password: '',

    });
    const [errors, setErrors] = useState<ValidationErrors>({});

    const [pinFormData, setPinFormData] = useState({
        new_pin: '',
        confirm_new_pin: '',
    });

    const [pinErrors, setPinErrors] = useState<PINValidationErrors>({});


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPinFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (params.id) {
            dispatch(_getResellerById(Number(params.id)));
        }
    }, [params.id, dispatch]);

    if (!singleReseller) {
        return <p>Loading...</p>;
    }

    const passwordSchema = Yup.object({
        new_password: Yup.string()
            .min(8, "Min length 8")
            .required("New Password is required"),
        confirm_new_password: Yup.string()
            .oneOf([Yup.ref('new_password'), ''], "Password does't match")
            .required("Confirm Password required"),
    });

    const pinSchema = Yup.object({
        new_pin: Yup.string()
            .length(4, "Min Length 4")
            .required("Pin is required"),
        confirm_new_pin: Yup.string()
            .oneOf([Yup.ref('new_pin'), ''], "Pin does't match")
            .required("Pin is required"),
    });





    const handlePasswordChange = async () => {
        try {
            // Validate form data
            await passwordSchema.validate(passwordFormData, { abortEarly: false });

            // If validation succeeds, submit the data
            const bodyData = {
                admin_password: singleReseller.account_password,
                new_password: passwordFormData.new_password,
                confirm_new_password: passwordFormData.confirm_new_password,
                reseller_id: params.id,
            };
            dispatch(_changeResellerPassword(bodyData, toast));
            setShowPasswordDialog(false);
        } catch (validationErrors:any) {
            // Extract validation errors
            const formattedErrors = validationErrors.inner.reduce(
                (acc: ValidationErrors, err: Yup.ValidationError) => ({
                    ...acc,
                    [err.path!]: err.message,
                }),
                {}
            );
            setErrors(formattedErrors);
        }
    };




    // const handlePinChange = () => {
    //     const bodyData={
    //         new_pin:new_pin,
    //         confirm_new_pin:confirm_new_pin,
    //         reseller_id:params.id
    //      }
    //     dispatch(_changeResellerPin(bodyData,toast))
    //     setShowPinDialog(false);
    //     setNew_pin('')
    //     setConfirm_new_pin('')
    // };

    const handlePinChange = async () => {
        try {
            // Validate pin form data using the schema
            await pinSchema.validate(pinFormData, { abortEarly: false });

            // If validation succeeds, submit the data
            const bodyData = {
                new_pin: pinFormData.new_pin,
                confirm_new_pin: pinFormData.confirm_new_pin,
                reseller_id: params.id,
            };
            dispatch(_changeResellerPin(bodyData, toast));
            setShowPinDialog(false);
            setPinFormData({
                new_pin: '',
                confirm_new_pin: '',
            });
        } catch (validationErrors: any) {
            // Extract validation errors
            const formattedErrors = validationErrors.inner.reduce(
                (acc: ValidationErrors, err: Yup.ValidationError) => ({
                    ...acc,
                    [err.path!]: err.message,
                }),
                {}
            );
            setPinErrors(formattedErrors);
        }
    };






    return (
        <div className="grid -m-4">
        <div className="card p-2" style={{width:'100%'}}>

                <div className="flex gap-2">
                    <img
                        src={singleReseller.profile_image_url}
                        alt={singleReseller.reseller_name}
                        style={{
                            width: '110px',
                            height: '120px',
                            borderRadius: '10%',
                            objectFit: 'cover',
                        }}
                    />
                    <div className="gap-2">
                        <div className="gap-2 mb-3">
                            <i
                                className={PrimeIcons.USER}
                                style={{ marginRight: '0.5rem' }}
                            ></i>
                            <strong style={{fontSize:"18px"}}>{singleReseller.reseller_name}</strong>
                            <i
                                className={
                                    singleReseller.status === 1
                                        ? PrimeIcons.CHECK_CIRCLE
                                        : PrimeIcons.TIMES_CIRCLE
                                }
                                style={{
                                    fontSize:'1.5rem',
                                    marginLeft: '0.5rem',
                                    color: singleReseller.status === 1 ? 'green' : 'red',
                                }}
                            ></i>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <p>
                                <i
                                    className={PrimeIcons.USER}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                {singleReseller.contact_name}
                            </p>
                            <p>
                                <i
                                    className={PrimeIcons.PHONE}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                {singleReseller.phone}
                            </p>
                            <p>
                                <i
                                    className={PrimeIcons.GLOBE}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                {singleReseller.country?.country_name}
                            </p>
                            <p>
                                <i
                                    className={PrimeIcons.MAP}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                {singleReseller.province?.province_name}
                            </p>
                            <p>
                                <i
                                    className={PrimeIcons.MAP_MARKER}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                {singleReseller.districts?.district_name}
                            </p>
                            <p>
                                <i
                                    className={PrimeIcons.ENVELOPE}
                                    style={{ marginRight: '0.5rem' }}
                                ></i>
                                <span style={{fontSize:"12px"}}>{singleReseller.email}</span>
                            </p>
                        </div>
                    </div>

                </div>



                    <div className="grid mt-2">

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.balance} {userInfo?.currency?.symbol}</h4>
                                <span>{t('RESELLER.VIEW.BALANCE')}</span>
                            </div>
                        </div>

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.today_orders}</h4>
                                <span>{t('RESELLER.VIEW.TODAYORDER')}</span>
                            </div>
                        </div>


                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.total_orders}</h4>
                                <span>{t('RESELLER.VIEW.TOTALORDER')}</span>
                            </div>
                        </div>

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.today_sale}</h4>
                                <span>{t('RESELLER.VIEW.TODAYSALE')}</span>
                            </div>
                        </div>

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.total_sale}</h4>
                                <span>{t('RESELLER.VIEW.TOTALSALE')}</span>
                            </div>
                        </div>

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.today_profit}</h4>
                                <span>{t('RESELLER.VIEW.TODAYPROFIT')}</span>
                            </div>
                        </div>

                        <div className="col-6 lg:col-6 xl:col-3" >
                            <div className="card" style={{maxHeight:'120px'}}>
                                <h4>{singleReseller.total_profit}</h4>
                                <span>{t('RESELLER.VIEW.TOTALPROFIT')}</span>
                            </div>
                        </div>

                    </div>


            <TabView>
                <TabPanel header="Overview">
                <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                        quae ab illo inventore veritatis et quasi architecto beatae
                        vitae dicta sunt explicabo.
                    </p>
                </TabPanel>
                <TabPanel header="Settings">
                    <div className="card" style={{margin:"-20px", marginTop:'10px',marginBottom:'30px'}}>
                        <h5>{t('RESELLER.PASSWORDSETTING.RESELLERPASSWORDSETTING')}</h5>
                        <hr />
                        <div style={{paddingBottom:'40px',display:'flex', justifyContent:'space-between'}}>
                            <div>
                                <strong>{t('RESELLER.PASSWORDSETTING.CHANGEPASSWORD')}</strong>
                                <p>{t('RESELLER.PASSWORDSETTING.YOUCANCHANGE')}</p>
                            </div>
                            <div>
                                <Button label={t('RESELLER.PASSWORDSETTING.CHANGEPASSWORD')} severity="info" rounded onClick={() => setShowPasswordDialog(true)}/>
                            </div>
                        </div>
                        <hr />
                    </div>

                    <div className="card" style={{margin:"-20px"}}>
                        <h5>{t('RESELLER.PINSETTING.RESELLERPINSETTING')}</h5>
                        <hr />
                        <div style={{paddingBottom:'40px',display:'flex', justifyContent:'space-between'}}>
                            <div>
                                <strong>{t('RESELLER.PINSETTING.CHANGEPIN')}</strong>
                                <p>{t('RESELLER.PINSETTING.YOUCANCHANGE')}</p>
                            </div>
                            <div>
                                <Button label={t('RESELLER.PINSETTING.CHANGEPIN')} severity="info" rounded onClick={() => setShowPinDialog(true)}/>
                            </div>
                        </div>
                        <hr />
                    </div>
                </TabPanel>

            </TabView>
        {/* Change Password Dialog */}
        <Dialog
                visible={showPasswordDialog}
                header={t("RESELLER.PASSWORDSETTING.CHANGEPASSWORD")}
                onHide={() => setShowPasswordDialog(false)}
                style={{
                    width: '90%',
                    maxWidth: '500px',
                    margin: 'auto',
                }}
                footer={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '1rem',
                        }}
                    >
                        <Button
                            label={t("APP.GENERAL.CANCEL")}
                            icon="pi pi-times"
                            severity="danger"
                            onClick={() => setShowPasswordDialog(false)}
                        />
                        <Button
                            label={t("FORM.GENERAL.SUBMIT")}
                            icon="pi pi-check"
                            severity="success"
                            onClick={handlePasswordChange}
                            autoFocus
                        />
                    </div>
                }
            >
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <div className="field">
                        <label htmlFor="new_password" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {t("RESELLER.PASSWORDSETTING.NEWPASSWORD")}:
                        </label>
                        <InputText
                            id="new_password"
                            name="new_password"
                            value={passwordFormData.new_password}
                            onChange={handleInputChange}
                            type="password"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                            }}
                        />
                        {errors.new_password && <small className="p-error">{errors.new_password}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="confirm_new_password" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {t("RESELLER.PASSWORDSETTING.CONFIRMPASSWORD")}:
                        </label>
                        <InputText
                            id="confirm_new_password"
                            name="confirm_new_password"
                            value={passwordFormData.confirm_new_password}
                            onChange={handleInputChange}
                            type="password"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                fontSize: '1rem',
                            }}
                        />
                        {errors.confirm_new_password && (
                            <small className="p-error">{errors.confirm_new_password}</small>
                        )}
                    </div>
                </form>
            </Dialog>



            {/* Change PIN Dialog */}
            <Dialog
                visible={showPinDialog}
                header={t("RESELLER.PINSETTING.CHANGEPIN")}
                onHide={() => setShowPinDialog(false)}
                style={{ width: '90%', maxWidth: '400px', margin: 'auto' }}
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                        <Button
                            label={t("APP.GENERAL.CANCEL")}
                            icon="pi pi-times"
                            severity="danger"
                            onClick={() => {
                                setShowPinDialog(false);
                                setPinFormData({ new_pin: '', confirm_new_pin: '' });
                            }}
                        />
                        <Button
                            label={t("FORM.GENERAL.SUBMIT")}
                            icon="pi pi-check"
                            severity="success"
                            onClick={handlePinChange}
                            autoFocus
                        />
                    </div>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="field">
                        <label htmlFor="new_pin" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {t("RESELLER.PINSETTING.NEWPIN")}:
                        </label>
                        <InputText
                            id="new_pin"
                            name="new_pin"
                            value={pinFormData.new_pin}
                            onChange={handlePinInputChange}
                            type="password"
                            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                        />
                        {pinErrors.new_pin && <small className="p-error">{pinErrors.new_pin}</small>}
                    </div>
                    <div className="field">
                        <label htmlFor="confirm_new_pin" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            {t("RESELLER.PINSETTING.CONFIRMPIN")}:
                        </label>
                        <InputText
                            id="confirm_new_pin"
                            name="confirm_new_pin"
                            value={pinFormData.confirm_new_pin}
                            onChange={handlePinInputChange}
                            type="password"
                            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
                        />
                        {pinErrors.confirm_new_pin && <small className="p-error">{pinErrors.confirm_new_pin}</small>}
                    </div>
                </div>
            </Dialog>

        </div>
        </div>
    );
};

export default ResellerDetailsPage;
