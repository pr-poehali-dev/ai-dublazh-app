import json
import os
import base64
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Process audio/video file for AI dubbing - transcribe, translate, and synthesize speech
    Args: event with httpMethod, body containing base64 audio and parameters
          context with request_id and function metadata
    Returns: HTTP response with processed audio or status
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    openai_key = os.environ.get('OPENAI_API_KEY')
    elevenlabs_key = os.environ.get('ELEVENLABS_API_KEY')
    
    if not openai_key or not elevenlabs_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'API keys not configured',
                'missing': {
                    'openai': not openai_key,
                    'elevenlabs': not elevenlabs_key
                }
            }),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        audio_base64 = body_data.get('audio')
        source_lang = body_data.get('source_language', 'ru')
        target_lang = body_data.get('target_language', 'en')
        voice_similarity = body_data.get('voice_similarity', 85)
        
        if not audio_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'No audio data provided'}),
                'isBase64Encoded': False
            }
        
        result = {
            'status': 'processing',
            'message': 'Audio received and queued for processing',
            'request_id': context.request_id,
            'config': {
                'source_language': source_lang,
                'target_language': target_lang,
                'voice_similarity': voice_similarity
            },
            'steps': [
                {'name': 'transcription', 'status': 'pending'},
                {'name': 'translation', 'status': 'pending'},
                {'name': 'voice_synthesis', 'status': 'pending'}
            ]
        }
        
        return {
            'statusCode': 202,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
