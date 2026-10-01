import { Op } from 'sequelize';

/**
 * URL search params se Sequelize `where` + `order` banata hai.
 * Public listing aur admin listing dono yahi use karte hain.
 */
export function buildPropertyQuery(searchParams) {
  const get = (k) => searchParams.get(k) || '';
  const where = {};

  const type = get('type').toLowerCase();
  if (['buy', 'sell', 'rent'].includes(type)) where.type = type;

  if (get('city')) where.city = get('city');
  if (get('property_type')) where.property_type = get('property_type').toLowerCase();
  if (get('status')) where.status = get('status');
  if (get('furnishing')) where.furnishing = get('furnishing');
  if (get('facing')) where.facing = get('facing');

  const min = Number(get('minPrice'));
  const max = Number(get('maxPrice'));
  if (min || max) {
    where.price = {};
    if (min) where.price[Op.gte] = min;
    if (max) where.price[Op.lte] = max;
  }

  const beds = parseInt(get('minBeds'), 10);
  if (beds) where.bedrooms = { [Op.gte]: beds };

  const search = get('search').trim();
  if (search) {
    const like = { [Op.like]: `%${search}%` };
    where[Op.or] = [
      { title: like },
      { location: like },
      { city: like },
      { description: like },
    ];
  }

  const sortMap = {
    newest: [['created_at', 'DESC']],
    oldest: [['created_at', 'ASC']],
    price_asc: [['price', 'ASC']],
    price_desc: [['price', 'DESC']],
  };
  const order = sortMap[get('sort')] || sortMap.newest;

  return { where, order };
}
