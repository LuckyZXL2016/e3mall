package com.e3mall.sso.service;

import com.e3mall.common.utils.E3Result;
import com.e3mall.pojo.TbUser;

public interface RegisterService {
	
	public E3Result checkData(String param, int type);
	public E3Result register(TbUser user);
}
