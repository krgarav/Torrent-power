import { get, post, put, del } from './api_helper';

/* ===============================
   WAREHOUSE SETTING APIs
================================ */

/* GET ALL WAREHOUSES */
export const getAllWarehouses = async () => {
  return await get('/warehouse-setting');
};

/* CREATE WAREHOUSE */
export const createWarehouse = async (payload) => {
  return await post('/warehouse-setting', payload);
};

/* UPDATE WAREHOUSE */
export const updateWarehouse = async (id, payload) => {
  return await put(`/warehouse-setting/${id}`, payload);
};

/* DELETE WAREHOUSE */
export const deleteWarehouse = async (id) => {
  return await del(`/warehouse-setting/${id}`);
};
