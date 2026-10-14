<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => 'required|string|max:255',
            'story' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'cultural_category_id' => 'nullable|exists:cultural_categories,id',
            'heritage_origin' => 'nullable|string|max:100',
            'materials_used' => 'nullable|string|max:255',
            'cultural_significance' => 'nullable|string',
            'crafting_technique' => 'nullable|string|max:255',
            'crafting_time_hours' => 'nullable|integer|min:1',
            'artisan_story' => 'nullable|string',
            'cultural_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'is_handmade' => 'boolean',
            'is_fair_trade' => 'boolean',
            'supports_artisan' => 'boolean',
        ];

        if ($this->isMethod('post')) {
            $rules['image'] = 'required|image|mimes:jpeg,png,jpg,gif,webp|max:4096';
            $rules['cultural_images'] = 'nullable|array|max:5';
        }

        return $rules;
    }
}
