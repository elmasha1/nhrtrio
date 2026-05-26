<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@nhrtrio.test'],
            ['name' => 'NHR Admin', 'password' => 'password', 'role' => 'admin']
        );

        User::updateOrCreate(
            ['email' => 'customer@nhrtrio.test'],
            ['name' => 'Demo Customer', 'password' => 'password', 'role' => 'customer']
        );

        $categories = [
            ['name' => 'Men',        'description' => 'Modern essentials for him.',   'image' => 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200&q=70'],
            ['name' => 'Women',      'description' => 'Refined pieces for her.',      'image' => 'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=1200&q=70'],
            ['name' => 'Outerwear',  'description' => 'Coats, jackets, and layers.',  'image' => 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&q=70'],
            ['name' => 'Footwear',   'description' => 'Premium sneakers & boots.',    'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=70'],
            ['name' => 'Accessories','description' => 'Bags, belts, and details.',    'image' => 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=1200&q=70'],
        ];

        $catModels = [];
        foreach ($categories as $i => $c) {
            $catModels[] = Category::updateOrCreate(
                ['slug' => Str::slug($c['name'])],
                $c + ['sort_order' => $i, 'is_active' => true]
            );
        }
        $byCat = collect($catModels)->keyBy('name');

        $items = [
            ['cat' => 'Men',        'name' => 'Tailored Wool Overcoat',     'price' => 289.00, 'compare' => 359.00, 'gender' => 'men',    'mat' => 'Wool blend', 'img' => 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=70'],
            ['cat' => 'Men',        'name' => 'Slim Fit Linen Shirt',       'price' => 79.00,  'compare' => null,   'gender' => 'men',    'mat' => 'Linen',      'img' => 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=900&q=70'],
            ['cat' => 'Men',        'name' => 'Premium Selvedge Denim',     'price' => 139.00, 'compare' => null,   'gender' => 'men',    'mat' => 'Cotton',     'img' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=70'],
            ['cat' => 'Women',      'name' => 'Silk Wrap Midi Dress',       'price' => 219.00, 'compare' => 259.00, 'gender' => 'women',  'mat' => 'Silk',       'img' => 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=70'],
            ['cat' => 'Women',      'name' => 'Cashmere Crewneck Sweater',  'price' => 189.00, 'compare' => null,   'gender' => 'women',  'mat' => 'Cashmere',   'img' => 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=70'],
            ['cat' => 'Women',      'name' => 'High Waist Pleated Trouser', 'price' => 129.00, 'compare' => null,   'gender' => 'women',  'mat' => 'Wool blend', 'img' => 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=900&q=70'],
            ['cat' => 'Outerwear',  'name' => 'Quilted Down Puffer',        'price' => 249.00, 'compare' => 299.00, 'gender' => 'unisex', 'mat' => 'Nylon, down','img' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=900&q=70'],
            ['cat' => 'Outerwear',  'name' => 'Classic Trench Coat',        'price' => 329.00, 'compare' => null,   'gender' => 'women',  'mat' => 'Gabardine',  'img' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=70'],
            ['cat' => 'Footwear',   'name' => 'Italian Leather Sneaker',    'price' => 159.00, 'compare' => null,   'gender' => 'unisex', 'mat' => 'Calfskin',   'img' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=70'],
            ['cat' => 'Footwear',   'name' => 'Chelsea Suede Boot',         'price' => 219.00, 'compare' => 269.00, 'gender' => 'men',    'mat' => 'Suede',      'img' => 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=900&q=70'],
            ['cat' => 'Accessories','name' => 'Structured Leather Tote',    'price' => 199.00, 'compare' => null,   'gender' => 'women',  'mat' => 'Leather',    'img' => 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&q=70'],
            ['cat' => 'Accessories','name' => 'Hand-stitched Leather Belt', 'price' => 89.00,  'compare' => null,   'gender' => 'men',    'mat' => 'Leather',    'img' => 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900&q=70'],
        ];

        foreach ($items as $i => $row) {
            $p = Product::updateOrCreate(
                ['name' => $row['name']],
                [
                    'category_id'       => $byCat[$row['cat']]->id,
                    'sku'               => 'NHR-'.strtoupper(Str::random(6)),
                    'short_description' => $row['name'].' — crafted from '.$row['mat'].'.',
                    'description'       => "Designed in our atelier, the {$row['name']} is finished with meticulous attention to detail. Made from {$row['mat']}, it is built to last and refine your every day.\n\nFree shipping on orders over \$100. 30-day returns.",
                    'price'             => $row['price'],
                    'compare_price'     => $row['compare'],
                    'stock'             => rand(8, 40),
                    'sizes'             => $row['cat'] === 'Footwear' ? ['39','40','41','42','43','44'] : ['XS','S','M','L','XL'],
                    'colors'            => ['Black','Ivory','Navy','Sand'],
                    'material'          => $row['mat'],
                    'gender'            => $row['gender'],
                    'is_featured'       => $i < 6,
                    'status'            => 'active',
                    'sold_count'        => rand(5, 120),
                ]
            );
            $p->images()->delete();
            $p->images()->create(['url' => $row['img'], 'alt' => $row['name'], 'sort_order' => 0]);
        }

        Coupon::updateOrCreate(
            ['code' => 'WELCOME10'],
            ['type' => 'percent', 'value' => 10, 'min_total' => 50, 'is_active' => true]
        );
        Coupon::updateOrCreate(
            ['code' => 'NHR25'],
            ['type' => 'fixed', 'value' => 25, 'min_total' => 150, 'is_active' => true]
        );

        $this->command?->info('Seeded admin@nhrtrio.test / password and customer@nhrtrio.test / password');
    }
}
