package com.e3mall.content.service;

import java.util.List;

import com.e3mall.common.utils.E3Result;
import com.e3mall.pojo.TbContent;

public interface ContentService {

	E3Result addContent(TbContent content);
	List<TbContent> getContentListByCid(long cid);
}
