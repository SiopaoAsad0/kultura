<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CulturalCategoryRequest extends FormRequest
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
        return [
            'name' => 'required|string|max:255|unique:cultural_categories,name,' . $this->route('culturalCategory'),
            'description' => 'required|string',
            'heritage_origin' => 'required|string|max:100',
            'materials_used' => 'required|string|max:255',
            'traditional_technique' => 'required|string|max:255',
            'crafting_time_days' => 'required|integer|min:1',
            'skill_level' => 'required|in:beginner,intermediate,advanced,master',
            'is_endangered' => 'boolean',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ];
    }
}
