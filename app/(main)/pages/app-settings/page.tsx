/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { AppDispatch } from '@/app/redux/store';
import { ProgressBar } from 'primereact/progressbar';
import { FileUpload } from 'primereact/fileupload';
import withAuth from '../../authGuard';
import { useTranslation } from 'react-i18next';
import { customCellStyleImage } from '../../utilities/customRow';
import i18n from '@/i18n';
import { isRTL } from '../../utilities/rtlUtil';
import { InputSwitch } from 'primereact/inputswitch';
import { InputNumber } from 'primereact/inputnumber';
import { ColorPicker } from 'primereact/colorpicker';
import { fetchAppSettings, updateAppSettings } from '@/app/redux/actions/appSettingsActions';
import { AppSettings } from '@/types/interface';
import { TabView, TabPanel } from 'primereact/tabview';

const emptySettings: AppSettings = {
  is_instant_confirm: false,
  maintenance_mode: false,
  allow_new_registrations: false,
  default_currency: "",
  exchange_rate_usd_afn: 0,
  support_phone: "",
  support_email: "",
  support_whatsapp: "",
  alternative_contact_phone: "",
  alternative_whatsapp: "",
  telegram_username: "",
  telegram_url: "",
  facebook_page_url: "",
  instagram_handle: "",
  instagram_url: "",
  twitter_url: "",
  tiktok_url: "",
  youtube_url: "",
  website_url: "",
  app_name: "",
  app_name_i18n: {
    en: "",
    fa: "",
    ps: ""
  },
  app_slogan: "",
  app_slogan_i18n: {
    en: "",
    fa: "",
    ps: ""
  },
  logo_url: "",
  mobile_app_primary_color: "#3498db",
  mobile_app_secondary_color: "#FFC107",
  primary_color_font_color: "#FFFFFF",
  secondary_color_font_color: "#000000",
  extra_settings: {
    max_order_per_day: 0,
    min_topup_amount: 0,
    max_topup_amount: 0
  },
  integration_settings: {
    SETARAGAN_API_BASE_URL: "",
    SETARAGAN_API_USERNAME: "",
    SETARAGAN_API_AUTHKEY: "",
    SETARAGAN_MSISDN: "",
    SETARAGAN_REQUEST_ID: "",
    TELEGRAM_WEBHOOK_URL: "",
    TELEGRAM_BOT_TOKEN: ""
  }
};

const AppSettingsPage = () => {
    const [settings, setSettings] = useState<AppSettings>(emptySettings);
    const [settingsDialog, setSettingsDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const toast = useRef<Toast>(null);
    const dispatch = useDispatch<AppDispatch>();
    const { loading, settings: reduxSettings } = useSelector((state: any) => state.appSettingsReducer);
    const { t } = useTranslation();

    useEffect(() => {
        dispatch(fetchAppSettings());
    }, [dispatch]);

    useEffect(() => {
        if (reduxSettings) {
            setSettings(reduxSettings);
        }
    }, [reduxSettings]);

    const openSettings = () => {
        setSettingsDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSettingsDialog(false);
    };

    const saveSettings = () => {
        setSubmitted(true);

        if (!settings.app_name || !settings.support_email || !settings.support_phone) {
            toast.current?.show({
                severity: 'error',
                summary: t('VALIDATION_ERROR'),
                detail: t('PLEASE_FILLED_ALL_REQUIRED_FIELDS'),
                life: 3000
            });
            return;
        }

        dispatch(updateAppSettings(settings, toast, t));
        setSettingsDialog(false);
        setSubmitted(false);
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="flex justify-end items-center space-x-2">
                    <Button
                        style={{ gap: ['ar', 'fa', 'ps', 'bn'].includes(i18n.language) ? '0.5rem' : '' }}
                        label={t('APP_SETTINGS.EDIT_SETTINGS')}
                        icon="pi pi-cog"
                        severity="info"
                        className={['ar', 'fa', 'ps', 'bn'].includes(i18n.language) ? 'ml-2' : 'mr-2'}
                        onClick={openSettings}
                    />
                </div>
            </React.Fragment>
        );
    };

    const settingsDialogFooter = (
        <>
            <Button label={t('APP.GENERAL.CANCEL')} icon="pi pi-times" severity="danger" className={isRTL() ? 'rtl-button' : ''} onClick={hideDialog} />
            <Button label={t('FORM.GENERAL.SUBMIT')} icon="pi pi-check" severity="success" className={isRTL() ? 'rtl-button' : ''} onClick={saveSettings} />
        </>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="app_name" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_NAME')} *
                                </label>
                                <InputText
                                    id="app_name"
                                    value={settings.app_name}
                                    onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                                    required
                                    className={classNames({
                                        'p-invalid': submitted && !settings.app_name
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="app_slogan" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_SLOGAN')}
                                </label>
                                <InputText
                                    id="app_slogan"
                                    value={settings.app_slogan}
                                    onChange={(e) => setSettings({ ...settings, app_slogan: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="default_currency" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.DEFAULT_CURRENCY')}
                                </label>
                                <InputText
                                    id="default_currency"
                                    value={settings.default_currency}
                                    onChange={(e) => setSettings({ ...settings, default_currency: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="exchange_rate" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.EXCHANGE_RATE')}
                                </label>
                                <InputNumber
                                    id="exchange_rate"
                                    value={settings.exchange_rate_usd_afn}
                                    onValueChange={(e) => setSettings({ ...settings, exchange_rate_usd_afn: e.value || 0 })}
                                    mode="decimal"
                                    minFractionDigits={4}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="website_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.WEBSITE_URL')}
                                </label>
                                <InputText
                                    id="website_url"
                                    value={settings.website_url}
                                    onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label style={{ fontWeight: 'bold' }}>{t('APP_SETTINGS.FEATURES')}</label>
                                <div className="flex flex-column gap-3">
                                    <div className="flex align-items-center">
                                        <InputSwitch
                                            checked={settings.is_instant_confirm}
                                            onChange={(e) => setSettings({ ...settings, is_instant_confirm: e.value })}
                                        />
                                        <label className="ml-2">{t('APP_SETTINGS.INSTANT_CONFIRM')}</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <InputSwitch
                                            checked={settings.maintenance_mode}
                                            onChange={(e) => setSettings({ ...settings, maintenance_mode: e.value })}
                                        />
                                        <label className="ml-2">{t('APP_SETTINGS.MAINTENANCE_MODE')}</label>
                                    </div>
                                    <div className="flex align-items-center">
                                        <InputSwitch
                                            checked={settings.allow_new_registrations}
                                            onChange={(e) => setSettings({ ...settings, allow_new_registrations: e.value })}
                                        />
                                        <label className="ml-2">{t('APP_SETTINGS.ALLOW_REGISTRATIONS')}</label>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="app_name_en" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_NAME_EN')}
                                </label>
                                <InputText
                                    id="app_name_en"
                                    value={settings.app_name_i18n.en}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_name_i18n: { ...settings.app_name_i18n, en: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="app_name_fa" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_NAME_FA')}
                                </label>
                                <InputText
                                    id="app_name_fa"
                                    value={settings.app_name_i18n.fa}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_name_i18n: { ...settings.app_name_i18n, fa: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="app_name_ps" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_NAME_PS')}
                                </label>
                                <InputText
                                    id="app_name_ps"
                                    value={settings.app_name_i18n.ps}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_name_i18n: { ...settings.app_name_i18n, ps: e.target.value }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="app_slogan_en" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_SLOGAN_EN')}
                                </label>
                                <InputText
                                    id="app_slogan_en"
                                    value={settings.app_slogan_i18n.en}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_slogan_i18n: { ...settings.app_slogan_i18n, en: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="app_slogan_fa" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_SLOGAN_FA')}
                                </label>
                                <InputText
                                    id="app_slogan_fa"
                                    value={settings.app_slogan_i18n.fa}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_slogan_i18n: { ...settings.app_slogan_i18n, fa: e.target.value }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="app_slogan_ps" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.APP_SLOGAN_PS')}
                                </label>
                                <InputText
                                    id="app_slogan_ps"
                                    value={settings.app_slogan_i18n.ps}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        app_slogan_i18n: { ...settings.app_slogan_i18n, ps: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="support_phone" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.SUPPORT_PHONE')} *
                                </label>
                                <InputText
                                    id="support_phone"
                                    value={settings.support_phone}
                                    onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="support_email" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.SUPPORT_EMAIL')} *
                                </label>
                                <InputText
                                    id="support_email"
                                    value={settings.support_email}
                                    onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="support_whatsapp" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.SUPPORT_WHATSAPP')}
                                </label>
                                <InputText
                                    id="support_whatsapp"
                                    value={settings.support_whatsapp}
                                    onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="alternative_phone" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.ALTERNATIVE_PHONE')}
                                </label>
                                <InputText
                                    id="alternative_phone"
                                    value={settings.alternative_contact_phone}
                                    onChange={(e) => setSettings({ ...settings, alternative_contact_phone: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="alternative_whatsapp" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.ALTERNATIVE_WHATSAPP')}
                                </label>
                                <InputText
                                    id="alternative_whatsapp"
                                    value={settings.alternative_whatsapp}
                                    onChange={(e) => setSettings({ ...settings, alternative_whatsapp: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="telegram_username" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TELEGRAM_USERNAME')}
                                </label>
                                <InputText
                                    id="telegram_username"
                                    value={settings.telegram_username}
                                    onChange={(e) => setSettings({ ...settings, telegram_username: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="telegram_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TELEGRAM_URL')}
                                </label>
                                <InputText
                                    id="telegram_url"
                                    value={settings.telegram_url}
                                    onChange={(e) => setSettings({ ...settings, telegram_url: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="facebook_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.FACEBOOK_URL')}
                                </label>
                                <InputText
                                    id="facebook_url"
                                    value={settings.facebook_page_url}
                                    onChange={(e) => setSettings({ ...settings, facebook_page_url: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="instagram_handle" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.INSTAGRAM_HANDLE')}
                                </label>
                                <InputText
                                    id="instagram_handle"
                                    value={settings.instagram_handle}
                                    onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="instagram_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.INSTAGRAM_URL')}
                                </label>
                                <InputText
                                    id="instagram_url"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="twitter_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TWITTER_URL')}
                                </label>
                                <InputText
                                    id="twitter_url"
                                    value={settings.twitter_url}
                                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="tiktok_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TIKTOK_URL')}
                                </label>
                                <InputText
                                    id="tiktok_url"
                                    value={settings.tiktok_url}
                                    onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="youtube_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.YOUTUBE_URL')}
                                </label>
                                <InputText
                                    id="youtube_url"
                                    value={settings.youtube_url}
                                    onChange={(e) => setSettings({ ...settings, youtube_url: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'branding':
                return (
                    <div className="grid p-fluid">
                        <div className="col-12">
                            {settings.logo_url && (
                                <img
                                    src={settings.logo_url}
                                    alt="App Logo"
                                    width="150"
                                    className="mt-0 mx-auto mb-5 block shadow-2"
                                />
                            )}
                            <FileUpload
                                mode="basic"
                                name="logo"
                                accept="image/*"
                                customUpload
                                onSelect={(e) => {
                                    // Handle logo upload logic here
                                }}
                                style={{ textAlign: 'center', marginBottom: '20px' }}
                            />
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="primary_color" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.PRIMARY_COLOR')}
                                </label>
                                <ColorPicker
                                    id="primary_color"
                                    value={settings.mobile_app_primary_color}
                                    onChange={(e) => setSettings({ ...settings, mobile_app_primary_color: e.value as string })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="primary_font_color" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.PRIMARY_FONT_COLOR')}
                                </label>
                                <ColorPicker
                                    id="primary_font_color"
                                    value={settings.primary_color_font_color}
                                    onChange={(e) => setSettings({ ...settings, primary_color_font_color: e.value as string })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="secondary_color" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.SECONDARY_COLOR')}
                                </label>
                                <ColorPicker
                                    id="secondary_color"
                                    value={settings.mobile_app_secondary_color}
                                    onChange={(e) => setSettings({ ...settings, mobile_app_secondary_color: e.value as string })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="secondary_font_color" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.SECONDARY_FONT_COLOR')}
                                </label>
                                <ColorPicker
                                    id="secondary_font_color"
                                    value={settings.secondary_color_font_color}
                                    onChange={(e) => setSettings({ ...settings, secondary_color_font_color: e.value as string })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'limits':
                return (
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="max_orders" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.MAX_ORDERS_PER_DAY')}
                                </label>
                                <InputNumber
                                    id="max_orders"
                                    value={settings.extra_settings.max_order_per_day}
                                    onValueChange={(e) => setSettings({
                                        ...settings,
                                        extra_settings: { ...settings.extra_settings, max_order_per_day: e.value || 0 }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="min_topup" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.MIN_TOPUP_AMOUNT')}
                                </label>
                                <InputNumber
                                    id="min_topup"
                                    value={settings.extra_settings.min_topup_amount}
                                    onValueChange={(e) => setSettings({
                                        ...settings,
                                        extra_settings: { ...settings.extra_settings, min_topup_amount: e.value || 0 }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-4">
                            <div className="field">
                                <label htmlFor="max_topup" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.MAX_TOPUP_AMOUNT')}
                                </label>
                                <InputNumber
                                    id="max_topup"
                                    value={settings.extra_settings.max_topup_amount}
                                    onValueChange={(e) => setSettings({
                                        ...settings,
                                        extra_settings: { ...settings.extra_settings, max_topup_amount: e.value || 0 }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'integration':
                return (
                    <div className="grid p-fluid">
                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="api_base_url" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.API_BASE_URL')}
                                </label>
                                <InputText
                                    id="api_base_url"
                                    value={settings.integration_settings.SETARAGAN_API_BASE_URL}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            SETARAGAN_API_BASE_URL: e.target.value
                                        }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="api_username" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.API_USERNAME')}
                                </label>
                                <InputText
                                    id="api_username"
                                    value={settings.integration_settings.SETARAGAN_API_USERNAME}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            SETARAGAN_API_USERNAME: e.target.value
                                        }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="api_authkey" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.API_AUTHKEY')}
                                </label>
                                <InputText
                                    id="api_authkey"
                                    value={settings.integration_settings.SETARAGAN_API_AUTHKEY}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            SETARAGAN_API_AUTHKEY: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <div className="field">
                                <label htmlFor="api_msisdn" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.API_MSISDN')}
                                </label>
                                <InputText
                                    id="api_msisdn"
                                    value={settings.integration_settings.SETARAGAN_MSISDN}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            SETARAGAN_MSISDN: e.target.value
                                        }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="api_request_id" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.API_REQUEST_ID')}
                                </label>
                                <InputText
                                    id="api_request_id"
                                    value={settings.integration_settings.SETARAGAN_REQUEST_ID}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            SETARAGAN_REQUEST_ID: e.target.value
                                        }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="telegram_webhook" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TELEGRAM_WEBHOOK')}
                                </label>
                                <InputText
                                    id="telegram_webhook"
                                    value={settings.integration_settings.TELEGRAM_WEBHOOK_URL}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            TELEGRAM_WEBHOOK_URL: e.target.value
                                        }
                                    })}
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="telegram_bot_token" style={{ fontWeight: 'bold' }}>
                                    {t('APP_SETTINGS.TELEGRAM_BOT_TOKEN')}
                                </label>
                                <InputText
                                    id="telegram_bot_token"
                                    value={settings.integration_settings.TELEGRAM_BOT_TOKEN}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        integration_settings: {
                                            ...settings.integration_settings,
                                            TELEGRAM_BOT_TOKEN: e.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="grid crud-demo -m-5">
            <div className="col-12">
                <div className="card p-2">
                    {loading && <ProgressBar mode="indeterminate" style={{ height: '6px' }} />}
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

                    <div className="card">
                        <div className="grid">
                            <div className="col-12 md:col-3">
                                <div className="p-3 border-round surface-card">
                                    <h4>{t('APP_SETTINGS.APP_SETTINGS')}</h4>
                                    <div className="flex flex-column gap-2">
                                        <Button
                                            label={t('APP_SETTINGS.GENERAL')}
                                            className={`p-button-text ${activeTab === 'general' ? 'p-button-primary' : 'p-button-secondary'}`}
                                            onClick={() => setActiveTab('general')}
                                        />
                                        <Button
                                            label={t('APP_SETTINGS.CONTACT_INFO')}
                                            className={`p-button-text ${activeTab === 'contact' ? 'p-button-primary' : 'p-button-secondary'}`}
                                            onClick={() => setActiveTab('contact')}
                                        />
                                        <Button
                                            label={t('APP_SETTINGS.BRANDING')}
                                            className={`p-button-text ${activeTab === 'branding' ? 'p-button-primary' : 'p-button-secondary'}`}
                                            onClick={() => setActiveTab('branding')}
                                        />
                                        <Button
                                            label={t('APP_SETTINGS.LIMITS')}
                                            className={`p-button-text ${activeTab === 'limits' ? 'p-button-primary' : 'p-button-secondary'}`}
                                            onClick={() => setActiveTab('limits')}
                                        />
                                        <Button
                                            label={t('APP_SETTINGS.INTEGRATION')}
                                            className={`p-button-text ${activeTab === 'integration' ? 'p-button-primary' : 'p-button-secondary'}`}
                                            onClick={() => setActiveTab('integration')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 md:col-9">
                                <div className="p-3 border-round surface-card">
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Dialog
                        visible={settingsDialog}
                        style={{ width: '900px', maxHeight: '80vh' }}
                        header={t('FORM.GENERAL.SUBMIT')}
                        modal
                        className="p-fluid"
                        footer={settingsDialogFooter}
                        onHide={hideDialog}
                    >
                        <div className="card" style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                            <TabView activeIndex={['general', 'contact', 'branding', 'limits', 'integration'].indexOf(activeTab)}
                                onTabChange={(e) => setActiveTab(['general', 'contact', 'branding', 'limits', 'integration'][e.index])}>
                                <TabPanel header={t('APP_SETTINGS.GENERAL')}>
                                    {activeTab === 'general' && renderTabContent()}
                                </TabPanel>
                                <TabPanel header={t('APP_SETTINGS.CONTACT_INFO')}>
                                    {activeTab === 'contact' && renderTabContent()}
                                </TabPanel>
                                <TabPanel header={t('APP_SETTINGS.BRANDING')}>
                                    {activeTab === 'branding' && renderTabContent()}
                                </TabPanel>
                                <TabPanel header={t('APP_SETTINGS.LIMITS')}>
                                    {activeTab === 'limits' && renderTabContent()}
                                </TabPanel>
                                <TabPanel header={t('APP_SETTINGS.INTEGRATION')}>
                                    {activeTab === 'integration' && renderTabContent()}
                                </TabPanel>
                            </TabView>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(AppSettingsPage);
