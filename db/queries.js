// db/queries.js

const collectionQueries = {
  create: `
    INSERT INTO product_collection 
    (name, isactive, isdeleted, business_id, description, sort, image, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  getAll: `
    SELECT * FROM product_collection 
    WHERE isdeleted = 0 AND business_id = ? 
    ORDER BY id DESC
  `,
  
  getById: `
    SELECT * FROM product_collection 
    WHERE id = ? AND isdeleted = 0
  `,
  
  updateWithImage: `
    UPDATE product_collection 
    SET name=?, isactive=?, business_id=?, description=?, sort=?, parent_id=?, image=? 
    WHERE id=? AND isdeleted=0
  `,
  
  updateWithoutImage: `
    UPDATE product_collection 
    SET name=?, isactive=?, business_id=?, description=?, sort=?, parent_id=? 
    WHERE id=? AND isdeleted=0
  `,
  
  softDelete: `
    UPDATE product_collection 
    SET isdeleted = 1 
    WHERE id = ?
  `
};

// --- ADDED BRAND QUERIES HERE ---
const brandQueries = {
  create: `
    INSERT INTO brand_details 
    (name, logo_url, created_datetime, isdeleted) 
    VALUES (?, ?, NOW(), 0)
  `,
  getAll: `
    SELECT * FROM brand_details 
    WHERE isdeleted = 0 
    ORDER BY id DESC
  `,
  updateWithImage: `
    UPDATE brand_details 
    SET name=?, logo_url=? 
    WHERE id=? AND isdeleted=0
  `,
  updateWithoutImage: `
    UPDATE brand_details 
    SET name=? 
    WHERE id=? AND isdeleted=0
  `,
  softDelete: `
    UPDATE brand_details 
    SET isdeleted = 1, deleted_datetime = NOW() 
    WHERE id = ?
  `
};

// --- ADDED OUTLET QUERIES HERE ---
const outletQueries = {
  create: `
    INSERT INTO business_outlet_details 
    (business_id, name, name_in_arabic, Email, Phone, Whatsapp, tax_registration_number, countryid, time_zoneid, currencyid, languageid, samedaydelivery, nextdaydelivery, taxrate, isinclusive) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  getAll: `
    SELECT * FROM business_outlet_details 
    WHERE business_id = ? 
    ORDER BY id DESC
  `,
  update: `
    UPDATE business_outlet_details SET 
    name=?, name_in_arabic=?, Email=?, Phone=?, Whatsapp=?, 
    tax_registration_number=?, countryid=?, time_zoneid=?, currencyid=?, 
    languageid=?, samedaydelivery=?, nextdaydelivery=?, taxrate=?, isinclusive=? 
    WHERE id=?
  `,
  hardDelete: `
    DELETE FROM business_outlet_details 
    WHERE id = ?
  `
};

// --- ADDED PAYMENT SETTINGS QUERIES HERE ---
const paymentSettingsQueries = {
  create: `
    INSERT INTO payment_gateway_setting_details 
    (business_id, payment_gateway_id, public_key, privste_key, created_datetime, isactive) 
    VALUES (?, ?, ?, ?, NOW(), ?)
  `,
  getAll: `
    SELECT id, payment_gateway_id, isactive 
    FROM payment_gateway_setting_details 
    WHERE business_id = ?
  `,
  update: `
    UPDATE payment_gateway_setting_details 
    SET public_key=?, privste_key=?, isactive=? 
    WHERE id=?
  `,
  hardDelete: `
    DELETE FROM payment_gateway_setting_details 
    WHERE id = ?
  `
};

// --- ADDED PRODUCT MEDIA QUERIES HERE ---
const productMediaQueries = {
  // Note the single '?' at the end. This allows MySQL to bulk-insert multiple rows at once.
  createBulk: `
    INSERT INTO product_media_details 
    (productid, filename, filelocation, isdeleted, createddatetime, business_id) 
    VALUES ?
  `,
  getByProductId: `
    SELECT * FROM product_media_details 
    WHERE productid = ? AND isdeleted = 0
  `,
  softDelete: `
    UPDATE product_media_details 
    SET isdeleted = 1, deleted_datetime = ? 
    WHERE id = ?
  `
};

// --- ADDED PRODUCT QUERIES HERE ---
const productQueries = {
  create: `
    INSERT INTO product 
    (name, shortdescription, longdescription, brandid, saleprice, Isaddon, isinventory, sku, costprice, sortorder, business_id, createddatetime, isdeleted) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)
  `,
  getAll: `
    SELECT * FROM product 
    WHERE isdeleted = 0 AND business_id = ? 
    ORDER BY sortorder ASC
  `,
  update: `
    UPDATE product 
    SET name=?, shortdescription=?, longdescription=?, brandid=?, saleprice=?, Isaddon=?, isinventory=?, sku=?, costprice=?, sortorder=?, altereddatetime=NOW() 
    WHERE id=? AND isdeleted=0
  `,
  softDelete: `
    UPDATE product 
    SET isdeleted = 1, altereddatetime = NOW() 
    WHERE id = ?
  `
};

// --- ADDED SLIDESHOW QUERIES HERE ---
const slideshowQueries = {
  create: `
    INSERT INTO theme_slide_show 
    (business_id, heading, subheading, button_text, button_link, issamewin, isactive, sorting, created_datetime, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)
  `,
  getAll: `
    SELECT * FROM theme_slide_show 
    WHERE business_id = ? 
    ORDER BY sorting ASC
  `,
  hardDelete: `
    DELETE FROM theme_slide_show 
    WHERE id = ?
  `
};

module.exports = {
  collectionQueries,
  brandQueries,
  outletQueries,
  paymentSettingsQueries,
  productMediaQueries,
  productQueries, 
  slideshowQueries
};