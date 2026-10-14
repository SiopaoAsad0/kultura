# Kultura — Database Entity Relationship Diagram (ERD)

> Auto-generated from the Laravel migrations in `backend/database/migrations`.
> **Roles:** `weaver` (seller), `user` (customer), `admin`.

---

## 1. ERD Diagram (Mermaid)

Copy the block below into any Mermaid renderer (GitHub, VS Code *Markdown Preview Mermaid Support*, [mermaid.live](https://mermaid.live)).

```mermaid
erDiagram
    users ||--o{ products : "weaver creates"
    users ||--o{ carts : "has"
    users ||--o{ orders : "places"
    users |o--o{ stories : "authors"
    users |o--o{ fundraisings : "organizes"
    users |o--o{ donations : "makes"
    users ||--o{ reviews : "writes"
    users |o--o{ page_views : "generates"

    cultural_categories ||--o{ products : "classifies"

    products ||--o{ carts : "added to"
    products ||--o{ order_items : "sold as"
    products ||--o{ reviews : "reviewed in"

    orders ||--o{ order_items : "contains"
    orders ||--o{ reviews : "reviewed in"
    riders ||--o{ orders : "delivers"

    fundraisings ||--o{ donations : "receives"

    users {
        bigint id PK
        varchar name
        varchar email UK
        timestamp email_verified_at
        varchar password
        enum role "weaver|user|admin"
        varchar remember_token
        timestamp created_at
        timestamp updated_at
    }

    cultural_categories {
        bigint id PK
        varchar name
        varchar slug UK
        text description
        varchar heritage_origin
        varchar materials_used
        varchar traditional_technique
        int crafting_time_days
        varchar skill_level
        boolean is_endangered
        varchar icon
        varchar banner_image
        timestamp created_at
        timestamp updated_at
    }

    products {
        bigint id PK
        varchar title
        text story
        int stock
        decimal price
        bigint weaver_id FK
        varchar image
        varchar image_url
        varchar heritage_origin
        bigint cultural_category_id FK
        varchar materials_used
        text cultural_significance
        varchar crafting_technique
        int crafting_time_hours
        varchar artisan_story
        json cultural_images
        boolean is_handmade
        boolean is_fair_trade
        boolean supports_artisan
        timestamp created_at
        timestamp updated_at
    }

    carts {
        bigint id PK
        bigint user_id FK
        bigint product_id FK
        int quantity
        timestamp created_at
        timestamp updated_at
    }

    riders {
        bigint id PK
        varchar name
        varchar phone
        varchar vehicle_type
        varchar plate_number
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    orders {
        bigint id PK
        bigint user_id FK
        bigint rider_id FK
        decimal subtotal
        decimal tax
        decimal total
        varchar status
        varchar delivery_status
        timestamp assigned_at
        timestamp delivered_at
        text delivery_notes
        varchar payment_status
        varchar payment_method
        varchar transaction_id
        text shipping_address
        text billing_address
        text notes
        timestamp created_at
        timestamp updated_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        varchar product_name
        decimal price
        int quantity
        decimal total
        timestamp created_at
        timestamp updated_at
    }

    stories {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar slug UK
        text excerpt
        longtext content
        varchar featured_image
        json gallery_images
        varchar category
        json tags
        varchar author_name
        varchar author_email
        text author_bio
        varchar location
        varchar status
        boolean is_featured
        int views_count
        int likes_count
        json metadata
        timestamp created_at
        timestamp updated_at
    }

    fundraisings {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar slug UK
        text description
        longtext full_description
        varchar featured_image
        json gallery_images
        varchar category
        json tags
        varchar organizer_name
        varchar organizer_email
        text organizer_bio
        varchar location
        decimal target_amount
        decimal current_amount
        char currency
        date start_date
        date end_date
        varchar status
        boolean is_featured
        boolean is_verified
        int donors_count
        json updates
        json metadata
        timestamp created_at
        timestamp updated_at
    }

    donations {
        bigint id PK
        bigint user_id FK
        bigint fundraising_id FK
        decimal amount
        text message
        boolean is_anonymous
        varchar payment_method
        varchar transaction_id
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    reviews {
        bigint id PK
        bigint user_id FK
        bigint product_id FK
        bigint order_id FK
        tinyint rating
        text comment
        timestamp created_at
        timestamp updated_at
    }

    page_views {
        bigint id PK
        bigint user_id FK
        varchar path
        varchar page
        varchar role
        varchar device
        varchar ip_address
        text user_agent
        timestamp created_at
    }

    imageries {
        bigint id PK
        varchar title
        text description
        varchar file_path
        varchar file_name
        varchar file_type
        int file_size
        int width
        int height
        varchar alt_text
        varchar category
        json tags
        varchar location
        varchar photographer_name
        varchar photographer_email
        text photographer_bio
        varchar status
        boolean is_featured
        boolean is_public
        int views_count
        int likes_count
        json metadata
        timestamp created_at
        timestamp updated_at
    }

    personal_access_tokens {
        bigint id PK
        varchar tokenable_type
        bigint tokenable_id
        varchar name
        varchar token UK
        text abilities
        timestamp last_used_at
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 2. Relationships (plain summary)

| Parent | Child | FK column | On delete | Meaning |
|---|---|---|---|---|
| `users` | `products` | `weaver_id` | cascade | A weaver creates many products |
| `cultural_categories` | `products` | `cultural_category_id` | set null | A product may belong to one category |
| `users` | `carts` | `user_id` | cascade | A customer's cart lines |
| `products` | `carts` | `product_id` | cascade | Products inside a cart |
| `users` | `orders` | `user_id` | cascade | A customer places many orders |
| `riders` | `orders` | `rider_id` | set null | A rider may be assigned to deliver an order |
| `orders` | `order_items` | `order_id` | cascade | Line items of an order |
| `products` | `order_items` | `product_id` | cascade | Product snapshot sold in an order |
| `users` | `stories` | `user_id` | set null | Optional author of a story |
| `users` | `fundraisings` | `user_id` | set null | Optional owner of a campaign |
| `fundraisings` | `donations` | `fundraising_id` | cascade | A campaign receives many donations |
| `users` | `donations` | `user_id` | set null | Optional donor (nullable / anonymous) |
| `users` | `reviews` | `user_id` | cascade | A customer writes reviews |
| `products` | `reviews` | `product_id` | cascade | A product has many reviews |
| `orders` | `reviews` | `order_id` | cascade | Review is tied to a delivered order |
| `users` | `page_views` | `user_id` | set null | Optional viewer of a page |
| `users` (polymorphic) | `personal_access_tokens` | `tokenable_type/id` | — | Sanctum API tokens |

> **Standalone tables (no foreign keys):** `imageries`, `cultural_categories` (parent only), `riders` (parent only), `password_reset_tokens`, `failed_jobs`.

---

## 3. Key enums / status values

- **`users.role`** → `weaver`, `user`, `admin`
- **`orders.status`** → `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- **`orders.delivery_status`** → `unassigned`, `assigned`, `picked_up`, `in_transit`, `delivered`, `failed`
- **`orders.payment_status`** → `unpaid`, `paid`, `refunded`, `failed`
- **`stories.status`** → `draft`, `published`, `archived`
- **`fundraisings.status`** → `active`, `completed`, `cancelled`, `suspended`
- **`donations.status`** → `completed`, `pending`, `refunded`, `failed`
- **`riders.status`** → `available`, `on_delivery`, `offline`
- **`riders.vehicle_type`** → `motorcycle`, `bicycle`, `van`

---

## 4. Core business flow

```
Weaver ──creates──▶ Product ──categorized by──▶ CulturalCategory
                        │
Customer ──adds──▶ Cart ──▶ Order ──contains──▶ OrderItem (snapshot of Product)
                            │   │
                            │   └──assigned──▶ Rider (delivery tracking)
                            │
                            └──(when delivered)──▶ Review (user + product + order)

Fundraising ──receives──▶ Donation ◀──made by── Customer
```


