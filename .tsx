<div>
    <div className="col-6 lg:col-6 xl:col-2">
                <div className="card mb-0" style={{ maxHeight: '140px', backgroundImage: 'linear-gradient(to right, #d1fae5, #99f6e4)' }}>
                    <div className="flex justify-content-between mb-3" style={{ fontSize: '12px' }}>
                        <div>
                            <span className="block text-500 text-sm font-medium mb-2">{t('DASHBOARD.PENDINGORDERS')}</span>
                            <div className="text-900 font-medium text-lg">{data?.pending_orders ?? 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-clock text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-6 lg:col-6 xl:col-2">
                <div className="card mb-0" style={{ maxHeight: '140px', backgroundImage: 'linear-gradient(to right, #fef9c3, #fed7aa)' }}>
                    <div className="flex justify-content-between mb-3" style={{ fontSize: '12px' }}>
                        <div>
                            <span className="block text-500 text-sm font-medium mb-2">{t('DASHBOARD.SUCCESSORDERS')}</span>
                            <div className="text-900 font-medium text-lg">{data?.success_orders ?? 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-check-circle text-green-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">85 </span>
                    <span className="text-500">responded</span> */}
                </div>
            </div>
            <div className="col-6 lg:col-6 xl:col-2">
                <div className="card mb-0" style={{ maxHeight: '140px', backgroundImage: 'linear-gradient(to right, #fae8ff, #e9d5ff)' }}>
                    <div className="flex justify-content-between mb-3" style={{ fontSize: '12px' }}>
                        <div>
                            <span className="block text-500 text-sm font-medium mb-2">{t('DASHBOARD.REJECTEDORDERS')}</span>
                            <div className="text-900 font-medium text-lg">{data?.rejected_orders ?? 0}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-times text-red-500 text-xl" />
                        </div>
                    </div>
                    {/* <span className="text-green-500 font-medium">24 new </span>
                    <span className="text-500">since last visit</span> */}
                </div>
            </div>

</div>
