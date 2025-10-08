<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoryRequest extends FormRequest
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
            'slug' => 'nullable|string|max:255|unique:stories,slug,' . $this->route('story'),
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'gallery_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            'category' => 'required|string|in:cordillera,culture,heritage,community,education,environment',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'author_bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'status' => 'required|string|in:draft,published,archived',
            'is_featured' => 'boolean',
            'metadata' => 'nullable|array',
        ];

        if ($this->isMethod('post')) {
            $rules['featured_image'] = 'required|image|mimes:jpeg,png,jpg,gif|max:5120';
            $rules['gallery_images'] = 'nullable|array|max:10';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The story title is required.',
            'excerpt.required' => 'The story excerpt is required.',
            'content.required' => 'The story content is required.',
            'category.required' => 'Please select a category for the story.',
            'author_name.required' => 'The author name is required.',
            'featured_image.required' => 'A featured image is required for new stories.',
            'featured_image.image' => 'The featured image must be a valid image file.',
            'featured_image.max' => 'The featured image must not be larger than 5MB.',
            'gallery_images.max' => 'You can upload a maximum of 10 gallery images.',
            'tags.array' => 'Tags must be provided as an array.',
            'status.required' => 'Please select a status for the story.',
        ];
    }
}
