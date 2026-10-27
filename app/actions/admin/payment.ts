'use server';

import api from '@/app/libs/api';

export default async function getAllPayments() {
    try {
        const serverApi = await api();
        const response = await serverApi.get('/admin/v1/payments');

        console.log(response.data);

        return response.data.data ?? response.data;
    } catch (error) {
        console.log(error);
    }
}